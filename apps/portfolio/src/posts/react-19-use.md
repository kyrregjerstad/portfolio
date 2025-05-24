---
title: 'React.use() and the Promise Lifecycle: A New Approach to Data in Components'
id: 0196dfff-7f2f-744e-99af-0642d0932ee3
published: true
publishedAt: '2025-05-24'
layout: 'blog'
categories: ['react', 'use', 'promise', 'data fetching', 'suspense', 'error boundaries']
slug: react-19-use
description: 'A guide to React.use() and the Promise Lifecycle'
seoTitle: 'React.use() and the Promise Lifecycle: A New Approach to Data in Components'
seoDescription: 'A guide to React.use() and the Promise Lifecycle'
seoKeywords: ['React.use()', 'promise', 'data fetching', 'suspense', 'error boundaries']
---

<script>
	import Suspense from '../components/visualizations/Suspense.svelte';
</script>

I've stared at data fetching code in React components more times than I can count. We've all been there, right? That dance of managing data, loading and error states. We initiate our asynchronous side-effects with a `useEffect` hook, set up the fetch, manage the lifecycle with a dependency array, and handle race conditions ensuring old requests don't overwrite new data when dependencies change or the component re-renders.

What if we could lose some of that ceremony?

```tsx
// The "classic" way
function MyComponent({ id }) {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let ignore = false;
		async function fetchData() {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(`/api/data/${id}`);
				if (!response.ok) throw new Error('Network response was not ok');
				const result = await response.json();
				if (!ignore) {
					setData(result);
				}
			} catch (e) {
				if (!ignore) {
					setError(e);
				}
			} finally {
				if (!ignore) {
					setIsLoading(false);
				}
			}
		}

		fetchData();
		return () => {
			ignore = true; // Cleanup for unmounted component
		};
	}, [id]);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!data) return null; // Or some other "no data" state

	return <div>{data.content}</div>;
}
```

It's... a lot. And while libraries like React Query or SWR have offered elegant abstractions over this, I've often wondered: what if React itself gave us a more direct way to deal with the values _inside_ these asynchronous operations, especially Promises?

Enter `React.use()`.

## Table of contents

## The Dream

Now, `use` isn't a Hook in the traditional "must be called at the top level" sense. The docs are clear: "Unlike React Hooks, `use` can be called within loops and conditional statements like `if`." This flexibility is interesting, and we'll touch on why that's powerful for context in a future post. But for today, let's focus on its relationship with Promises and data fetching.

The dream, when you first hear about `use` and Promises, is something like this:

```tsx
// The dream?
// ⛔ don't do this
import { use, Suspense } from 'react';

function MessageComponent({ messageId }) {
	// Can I just... do this?
	const messagePromise = fetch(`/api/messages/${messageId}`).then((res) => res.json());
	const message = use(messagePromise); // Unpack the promise!

	return <p>Here is the message: {message.content}</p>;
}

function App() {
	return (
		<Suspense fallback={<p>Loading message...</p>}>
			<MessageComponent messageId="123" />
		</Suspense>
	);
}
```

You pass a Promise to `use`, and it _suspends_ the component if the Promise is pending. If it's wrapped in a `<Suspense>` boundary, React will show the fallback. When the Promise resolves, `use` gives you the resolved value, and your component renders. If it rejects, it throws, and the nearest Error Boundary catches it. Beautiful, right? No more manual `isLoading` or `error` states for this common case!

### But Why Does It Keep Re-Fetching?

So, I tried the "dream" scenario above. At first glance, everything seemed to work smoothly - the component rendered and the data loaded without any visible errors. However, when I opened my browser's network inspector, I discovered something concerning: the fetch request was being fired repeatedly in an endless loop, even though the component itself wasn't re-rendering and the Suspense boundary remained stable after the initial load.

What gives?

The issue, as the React docs (and a bit of thinking) clarify, is that if `fetch` is called _inside_ the `MessageComponent` like that, a _new_ Promise is created on _every render_. If `use(messagePromise)` suspends, React will try to re-render. If `MessageComponent` re-renders and creates a _brand new_ `messagePromise`, `use` sees a new Promise, suspends again, and... you see where this is going. We get an infinite loop of network requests, even if it's not immediately apparent in the UI.

React needs to be sure that the Promise you pass to `use` is stable across re-renders—the _same_ Promise instance—at least until its underlying data genuinely needs to change.

I also tried to use `useMemo` and the React Compiler to memoize the promise creation, but it didn't work. The promise was still being recreated every time it resolved.

#### The Subtle "State Reset" with Client-Side use

Beyond the direct infinite loop, there's a more subtle behavior to be aware of when use first interacts with a promise in a client component. When a component first suspends or resolves due to `use`, React might perform an internal "state reset". This can cause initialization logic, including the function passed to `useMemo` (even with an empty dependency array `[]`), to run more than once initially.

This means even if you correctly memoize promise creation, you might observe your promise-creating function (and thus your API call) firing a couple of times right at the beginning when the component first mounts and use "settles in." While subsequent normal re-renders will respect the memoization, this initial double-take is a key reason why server-created promises often lead to a cleaner initial data load, as they sidestep this client-side component initialization phase with `use`. We'll see later how event-driven promise creation with `useState` neatly handles its own stability.

### Solution 1: Let the Server (Component) Handle It

The React documentation offers a simple solution, especially in the world of Server Components: **create the Promise in a Server Component and pass it down to a Client Component.**

```tsx
// --- Server Component (e.g., app/page.tsx in Next.js) ---
import { Suspense } from 'react';
import { Message } from './message.tsx';

export default function MyPage() {
	const messagePromise = fetchMessagePromise('123'); // Promise created on the server

	return (
		<div>
			<h1>My Page</h1>
			<Suspense fallback={<p>⏳ Waiting for message from server...</p>}>
				<Message messagePromise={messagePromise} />
			</Suspense>
		</div>
	);
}

async function fetchMessagePromise(id) {
	return fetch(`https://your-api.com/messages/${id}`).then((res) => {
		if (!res.ok) throw new Error('Failed to fetch message');
		return res.json();
	});
}
```

```tsx
'use client';
import { use } from 'react';

export function Message({ messagePromise }) {
	// `messagePromise` is stable; it came from the server as a prop
	const messageContent = use(messagePromise);
	return <p>Here is the message: {messageContent.text}</p>;
}
```

This pattern is powerful. The Server Component initiates the data fetching. It doesn't `await` the promise (which would block its own rendering), but rather passes the `Promise` itself as a prop to the `Message` Client Component. The `Message` component then uses `use` to "unwrap" this Promise.

Why is this great?

1.  **Stability:** The `messagePromise` is created once on the server (per request/render pass) and passed down. The Client Component receives the same promise instance across its re-renders (unless the parent re-renders and passes a _new_ one, which is fine if the data genuinely changed).
2.  **Streaming:** The Server Component can render its initial shell (like the `<h1>My Page</h1>`) immediately. The data for `Message` streams in, and Suspense handles the loading state on the client. This avoids the server's rendering being entirely blocked by the data fetch.
3.  **Colocation:** The Client Component `Message` still feels like it's "owning" the consumption of the data, even though the fetch was initiated elsewhere.

A key detail from the docs: "When passing a Promise from a Server Component to a Client Component, its resolved value must be serializable." This makes sense, as it has to cross the server-client boundary.

### Solution 2: Caching Promises on the Client

What if you're not using Server Components, or you _must_ fetch data initiated from a Client Component? We still need to ensure the Promise passed to `use` is stable.

The classic React tool for caching values across renders is `useMemo`.

```tsx
'use client';
import { use, useMemo, Suspense } from 'react';

export default function ClientFetcherComponent({ messageId }) {
	// Cache the promise itself!
	const messagePromise = useMemo(() => {
		return fetchMessageClientSide(messageId);
	}, [messageId]); // Re-fetch ONLY if messageId changes

	return (
		<Suspense fallback={<p>Client loading message {messageId}...</p>}>
			<MessageDisplay messagePromise={messagePromise} />
		</Suspense>
	);
}

async function fetchMessageClientSide(id) {
	const res = await fetch(`https://your-api.com/messages/${id}`);
	if (!res.ok) throw new Error('Failed to fetch message client-side');
	return res.json();
}

function MessageDisplay({ messagePromise }) {
	const messageContent = use(messagePromise);
	return <p>Client-side message: {messageContent.text}</p>;
}
```

Here, `useMemo` ensures that `fetchMessageClientSide(messageId)` is only called (and thus a new Promise created) when `messageId` changes. On subsequent re-renders with the same `messageId`, `useMemo` returns the _same cached Promise object_. This satisfies `use`'s need for a stable Promise.

The React docs caution: "Promises created in Client Components are recreated on every render. Promises passed from a Server Component to a Client Component are stable across re-renders." This strongly guides us towards the Server Component pattern when possible, but client-side caching with `useMemo` (or a similar mechanism) is our escape hatch.

An alternative to `useMemo` is to simply use the React Compiler to memoize the promise creation. In my testing, this worked great and saves us the overhead of memoizing the promise creation manually.

## What About Errors?

So `use` suspends for pending Promises. What happens when a Promise rejects?

1.  **Error Boundaries:** The idiomatic React way. If `use(myPromise)` is called and `myPromise` rejects, `use` will throw. If the component is wrapped in an Error Boundary, the boundary's `fallback` will be displayed.

    ```tsx
    import { ErrorBoundary } from 'react-error-boundary';

    <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
    	<Suspense fallback={<p>Loading...</p>}>
    		<MyDataFetchingComponent />
    	</Suspense>
    </ErrorBoundary>;
    ```

2.  **`.catch()` on the Promise:** You can also handle the rejection _before_ it even gets to `use` by attaching a `.catch()` to your Promise. Whatever your `.catch()` returns will become the "resolved" value for `use`.

    ```tsx
    // Server Component or where promise is created
    const messagePromise = fetchMessagePromise('123').catch((err) => {
    	console.error('Fetch failed:', err);
    	return { text: "Oops! Couldn't load the message. (Default)" }; // Provide a fallback value
    });

    // Client Component
    // const messageContent = use(messagePromise);
    // `messageContent` will be the object from .catch() if original promise rejected
    ```

    The docs specifically note: "`use` cannot be called in a `try-catch` block." This makes sense because `use` itself is the mechanism that _triggers_ the suspension or error throwing behavior that Suspense and Error Boundaries integrate with.

3.  **Combining Error Boundaries and Suspense:** Since these two patterns are commonly used together with `use`, we can create a convenient wrapper component that handles both error and loading states. Here's a type-safe implementation:

```tsx
import React, { Suspense, ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface SafeSuspenseProps {
	children: ReactNode;
	fallback?: ReactNode;
	errorFallback?: (props: FallbackProps) => ReactNode;
	onReset?: () => void;
}

const DefaultErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<div>
			<h2>Something went wrong:</h2>
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
};

export const SafeSuspense = ({
	children,
	fallback,
	errorFallback = DefaultErrorFallback,
	onReset,
}: SafeSuspenseProps) => {
	return (
		<ErrorBoundary FallbackComponent={errorFallback} onReset={onReset}>
			<Suspense fallback={fallback}>{children}</Suspense>
		</ErrorBoundary>
	);
};
```

Now you can use it like this:

```tsx
<SafeSuspense
	fallback={<p>Loading...</p>}
	errorFallback={({ error }) => <p>Error: {error.message}</p>}
	onReset={() => {
		// Clear any state or cached data if needed
	}}
>
	<MyDataFetchingComponent />
</SafeSuspense>
```

This pattern encapsulates the common error boundary + suspense combination, provides type safety, and includes a default error UI that can be customized when needed.

### Putting it all together

Try out the full example below:

<Suspense />

## Parallel Data Fetching

A common pattern is needing multiple pieces of data. If you `use` them naively and sequentially, you might create a waterfall:

```tsx
// Potentially creates a waterfall if fetchData1 and fetchData2 are inline calls
function MyComponent() {
	const data1 = use(fetchData1()); // Suspends...
	const data2 = use(fetchData2()); // Only runs after data1 resolves and component re-renders

	// ...
}
```

To fetch in parallel, create your Promises first, then `use` them:

```tsx
function MyParallelComponent() {
	// 1. Start all fetches
	const promise1 = fetchData1();
	const promise2 = fetchData2();

	// 2. Then use them. React will suspend until ALL promises passed to `use`
	//    in this render pass are resolved.
	const data1 = use(promise1);
	const data2 = use(promise2);

	return (
		<>
			<div>Data 1: {data1.content}</div>
			<div>Data 2: {data2.content}</div>
		</>
	);
}
// Or, using Promise.all
function MyPromiseAllComponent() {
	const allDataPromise = useMemo(() => Promise.all([fetchData1(), fetchData2()]), []);

	const [data1, data2] = use(allDataPromise);

	return (
		<>
			<div>Data 1: {data1.content}</div>
			<div>Data 2: {data2.content}</div>
		</>
	);
}
```

By initiating all Promises _before_ calling `use` on them (or by using `Promise.all`), you allow them to load concurrently. The component will suspend until all Promises that `use` is "tracking" in that render pass are settled.

## A New Primitive

`React.use()` feels like a new primitive that React is giving us to more ergonomically interact with its concurrent rendering capabilities. For data fetching, it elegantly bridges the gap between initiating an asynchronous operation and consuming its result within a component, while playing nicely with Suspense and Error Boundaries.

The key is remembering that `use` needs a stable Promise. Whether that stability comes from a Server Component prop, `useMemo`, or a more sophisticated cache, ensuring that identity is crucial.

It simplifies a common, boilerplate-heavy pattern, and I'm excited to see how we all integrate it into our applications. The way it handles Promises is quite direct, and it opens up interesting possibilities for how we structure our data flow. The story for `use` with Context is also compelling, but that is for another time.
