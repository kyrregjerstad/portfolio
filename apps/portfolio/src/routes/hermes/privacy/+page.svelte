<svelte:head>
	<title>Hermes privacy policy | Kyrre Gjerstad</title>
	<meta
		name="description"
		content="How Hermes Personal Assistant accesses, uses, stores and shares connected Google and WhatsApp data."
	/>
	<link rel="canonical" href="https://www.kyrre.dev/hermes/privacy" />
</svelte:head>

<section class="container mx-auto max-w-3xl py-12 sm:py-16">
	<a href="/hermes" class="text-muted-foreground text-sm underline underline-offset-4">Hermes Personal Assistant</a>
	<header class="mt-8 mb-10">
		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Privacy policy</h1>
		<p class="text-muted-foreground mt-4 text-sm">Last updated October 11, 2026</p>
	</header>
	<div class="prose prose-lg dark:prose-invert max-w-none">
		<p>
			I am Kyrre Gjerstad, the operator and sole user of Hermes Personal Assistant. This policy describes my private
			assistant's connected accounts. The public information pages do not provide access to the assistant or my account
			data.
		</p>
		<h2>Data access and purpose</h2>
		<p>
			With my authorization, Hermes reads Gmail messages, sender and recipient details, subjects, message content,
			attachments and mailbox metadata. I use this access to search email, summarize messages and answer questions. The
			ordinary assistant connection is read-only for Gmail. A separate expense worker has Gmail read/write authorization
			to archive matching invoices and receipts after saving and verifying their files. Its email writes are restricted
			to removing the Inbox label; it has no workflow for sending or deleting email.
		</p>
		<p>
			Hermes reads my list of Google calendars and calendar event details, including titles, descriptions, times,
			locations and attendees. It can create, update and delete events on calendars where my account has write
			permission. I use this access to review my schedule and manage events.
		</p>
		<p>
			The linked WhatsApp reader stores available chat and contact information, message content and message metadata,
			and can retrieve attachments. I use it to find and summarize messages. It has no tools for sending, editing or
			deleting messages or marking them as read.
		</p>
		<h2>Expense collection</h2>
		<p>
			The expense worker checks new incoming email for invoices and receipts from my selected work suppliers. Message
			content and relevant attachments are sent to OpenAI for classification. Google Pub/Sub carries mailbox change
			notifications containing my email address and a mailbox history identifier. The worker saves matching documents,
			their source emails and extracted metadata on my private server. It archives a message only after verifying that
			the matching documents were saved. On the 18th of each month, it sends the unreported documents and an expense
			index to my own Discord direct messages. These files then pass through Discord and are subject to Discord's
			retention policies. No expense claims or payments are submitted automatically.
		</p>
		<h2>AI processing and sharing</h2>
		<p>
			When I ask a question, relevant account content and conversation context may be sent to the configured AI provider
			to generate an answer. The current provider is OpenAI. The provider's terms and my account's data settings govern
			its processing and retention. I do not sell connected account data or use it for advertising.
		</p>
		<p>
			If I use Hermes through Discord, my prompts and the assistant's replies, including any account content in those
			replies, pass through Discord. A calendar action involving other attendees may also share event details through
			Google Calendar according to the action and calendar settings.
		</p>
		<p>
			Hermes Personal Assistant's use and transfer of information received from Google APIs adheres to the
			<a href="https://developers.google.com/terms/api-services-user-data-policy"
				>Google API Services User Data Policy</a
			>, including its Limited Use requirements.
		</p>
		<h2>Storage and retention</h2>
		<p>
			Expense documents, source emails, extracted metadata, delivery records, account credentials and the WhatsApp
			archive are stored on my private server with restricted file access. Retrieved account content may also appear in
			the assistant's saved conversations and logs. These records are retained until I delete them. Copies sent to
			OpenAI, Discord or other involved services are subject to those services' retention policies and account settings.
		</p>
		<h2>Disconnecting accounts and deleting data</h2>
		<p>
			I can revoke the Hermes Google connection in my
			<a href="https://myaccount.google.com/connections">Google account connections</a> and disconnect the WhatsApp reader
			in WhatsApp's Linked devices settings. Revoking access stops future access; it does not remove records already saved
			on the server or in chat services. I can delete the stored credentials, archive, conversations and logs separately.
		</p>
		<h2>These public pages</h2>
		<p>
			These pages are part of kyrre.dev and use the site's existing hosting and analytics services, including Vercel,
			Plausible and PostHog. Visiting them does not connect a Google or WhatsApp account or give access to private
			messages or events.
		</p>
		<h2>Contact and changes</h2>
		<p>
			For questions about this policy, contact
			<a href="mailto:kyrregjerstad@gmail.com">kyrregjerstad@gmail.com</a>. I will update this page if the assistant's
			data access or handling changes.
		</p>
	</div>
</section>
