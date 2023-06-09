<script lang="ts">
	import { superForm } from "sveltekit-superforms/client";
	import type { SuperValidated } from "sveltekit-superforms/index";
	import type { ContactFormSchema } from "$lib/schemas";
	import FormError from "./FormError.svelte";
	import Icon from "@iconify/svelte";

	export let data: SuperValidated<ContactFormSchema>;

	const { form, errors, enhance, delayed, message } = superForm(data);
</script>

<form id="contact" method="POST" use:enhance>
	<label for="name">Name</label>
	<input type="text" name="name" id="name" placeholder="Your name" required bind:value={$form.name} />
	<FormError errors={$errors.name} />

	<label for="subject">Subject</label>
	<input type="text" name="subject" id="subject" placeholder="Subject" required bind:value={$form.subject} />
	<FormError errors={$errors.subject} />

	<label for="email">Email</label>
	<input type="email" name="email" id="email" placeholder="Your email" required bind:value={$form.email} />
	<FormError errors={$errors.email} />

	<label for="message">Message</label>
	<textarea name="message" id="message" placeholder="Your message" required bind:value={$form.message} />
	<FormError errors={$errors.message} />

	<button type="submit">
		{$message || "Send"}
		{#if $delayed}
			<Icon icon="line-md:loading-loop" height={35} />
		{/if}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 30rem;
	}

	label {
		font-size: 0.8rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	input,
	textarea {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		background-color: transparent;
		border: 1px solid var(--font-color);
		color: var(--font-color);
		border-radius: 0.1rem;
		font-family: "JetBrains Mono", monospace;
		font-weight: 100;
		margin-top: 0.5rem;
	}

	input:focus,
	textarea:focus {
		outline: none;
	}

	textarea {
		height: 10rem;
	}

	button {
		font-variation-settings: var(--font-primary-settings);
		margin-top: 1.5rem;

		background: linear-gradient(
			var(--background-color) 0%,
			var(--background-color) 50%,
			var(--font-color) 50%,
			var(--font-color) 100%
		);
		background-size: 200% 200%;
		background-position: right top;

		transition: all 150ms ease-in-out;
	}

	button:hover {
		color: var(--background-color);
		background-position: right bottom;
		font-variation-settings: var(--font-hover-settings);
	}
</style>
