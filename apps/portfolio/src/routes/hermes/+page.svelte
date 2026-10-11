<svelte:head>
	<title>Hermes Personal Assistant | Kyrre Gjerstad</title>
	<meta
		name="description"
		content="Hermes Personal Assistant is Kyrre Gjerstad's private assistant for email, calendar events and WhatsApp messages."
	/>
	<link rel="canonical" href="https://www.kyrre.dev/hermes" />
</svelte:head>

<section class="container mx-auto max-w-3xl py-12 sm:py-16">
	<a href="/" class="text-muted-foreground text-sm underline underline-offset-4">kyrre.dev</a>
	<header class="mt-8 mb-10">
		<p class="text-muted-foreground mb-3 text-sm">A private assistant by Kyrre Gjerstad</p>
		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Hermes Personal Assistant</h1>
	</header>
	<div class="prose prose-lg dark:prose-invert max-w-none">
		<p>
			Hermes helps me find information in my email and messages, understand my schedule, and manage calendar events. I
			run it on my own private server for personal use. These pages explain the assistant and its data access.
		</p>
		<h2>Connected accounts</h2>
		<ul>
			<li>
				<strong>Gmail:</strong> read messages and their metadata to search my inbox, summarize email and find relevant information.
				The ordinary assistant connection is read-only. A separate expense worker saves matching work receipts and archives
				their emails after verifying the saved files. It sends a monthly bundle to my own Discord direct messages.
			</li>
			<li>
				<strong>Google Calendar:</strong> read my calendar list and events, and create, update or delete events on calendars
				where I have permission to make changes.
			</li>
			<li>
				<strong>WhatsApp:</strong> search and read messages available through a linked personal account. The reader has no
				tools for sending messages.
			</li>
		</ul>
		<h2>How it works</h2>
		<p>
			I ask Hermes a question through its private chat interface or my Discord bot. It retrieves relevant information
			from the connected accounts and uses an AI model to prepare an answer. Requested account content may be sent to
			that model provider, and answers sent through Discord pass through Discord.
		</p>
		<p>
			This is a personal integration for my own accounts. It is not a public service and does not offer account
			registration.
		</p>
		<h2>Privacy and contact</h2>
		<p>
			The <a href="/hermes/privacy">Hermes privacy policy</a> explains the data the assistant accesses, how it uses and stores
			that data, and how to disconnect an account.
		</p>
		<p>Contact: <a href="mailto:kyrregjerstad@gmail.com">kyrregjerstad@gmail.com</a>.</p>
	</div>
</section>
