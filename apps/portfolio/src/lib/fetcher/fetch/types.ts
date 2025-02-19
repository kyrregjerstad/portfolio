// apps/portfolio/src/lib/fetcher/fetch/types.ts
export type FetcherOptions<T, TError = Error> = {
	// Initial data to show while loading
	initialData?: T;

	// How long until data is considered stale (in ms)
	staleTime?: number;

	// Whether to start fetching immediately
	immediate?: boolean;

	// Whether to enable server-side rendering
	ssr?: boolean;

	// Whether to persist data to localStorage
	persist?: boolean;

	// Whether to throw errors instead of handling them internally
	throwOnError?: boolean;

	// Auto-revalidation options
	revalidateOnFocus?: boolean;
	revalidateOnReconnect?: boolean;

	// Transform response data
	transform?: (data: unknown) => T;

	// Transform errors
	transformError?: (error: unknown) => TError;

	// Callbacks
	onSuccess?: (data: T) => void;
	onError?: (error: TError) => void;

	// Fetch options to pass to the fetch call
	fetchOptions?: RequestInit;
};

export type FetchConfig = {
	// Whether to show loading state even if we have data
	showLoading?: boolean;

	// Additional fetch options to merge with default options
	fetchOptions?: RequestInit;
};

export type MutateConfig<TData, T, TError = Error> = {
	// Whether to update data optimistically
	optimistic?: boolean;

	// Function to generate optimistic data
	optimisticUpdate?: (newData: TData, currentData?: T) => T;

	// Callbacks
	onSuccess?: (data: T) => void;
	onError?: (error: TError) => void;

	// Fetch options to pass to the fetch call
	fetchOptions?: RequestInit;
};
