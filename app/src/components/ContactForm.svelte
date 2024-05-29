<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import type { ContactForm } from '$lib/schema/contactSchema';
	import CustomToast from './CustomToast.svelte';

	let { contactForm }: { contactForm: SuperValidated<Infer<ContactForm>> } = $props();

	const form = superForm(contactForm, {
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.custom(CustomToast, {
					componentProps: {
						title: 'Success',
						message: `Roger that, I'll get back to you soon!`,
					},
				});
			} else if (result.status === 500) {
				toast.custom(CustomToast, {
					componentProps: {
						title: 'Error',
						message: 'Failed to send message, please try again later.',
						error: true,
					},
				});
			}
		},
	});

	let { form: formData, enhance, errors } = form;
</script>

<form id="contact" method="POST" use:enhance class="flex max-w-lg flex-col gap-4">
	<div class="grid">
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			id="name"
			placeholder="Your name"
			required
			class="bg-background border-primary border border-opacity-50 p-2 focus:border-teal-500 focus:outline-none"
			bind:value={$formData.name}
		/>
		<div>
			{#if $errors.name}
				<p class="text-red-500">{$errors.name}</p>
			{/if}
		</div>
	</div>

	<div class="grid">
		<label for="subject">Subject</label>
		<input
			type="text"
			name="subject"
			id="subject"
			placeholder="Subject"
			required
			class="bg-background border-primary border border-opacity-50 p-2 focus:border-teal-500 focus:outline-none"
			bind:value={$formData.subject}
		/>
		<div>
			{#if $errors.subject}
				<p class="text-red-500">{$errors.subject}</p>
			{/if}
		</div>
	</div>

	<div class="grid">
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			placeholder="Your email"
			required
			class="bg-background border-primary border border-opacity-50 p-2 focus:border-teal-500 focus:outline-none"
			bind:value={$formData.email}
		/>
		<div>
			{#if $errors.email}
				<p class="text-red-500">{$errors.email}</p>
			{/if}
		</div>
	</div>

	<div class="grid">
		<label for="message">Message</label>
		<textarea
			name="message"
			id="message"
			placeholder="Your message"
			required
			class="bg-background border-primary border border-opacity-50 p-2 focus:border-teal-500 focus:outline-none"
			rows="10"
			bind:value={$formData.message}
		>
		</textarea>
		<div>
			{#if $errors.message}
				<p class="text-red-500">{$errors.message}</p>
			{/if}
		</div>
	</div>
	<div class="absolute opacity-0">
		<input type="checkbox" id="botCheck" name="botCheck" tabindex="-1" />
		<label for="botCheck"> I'm not a robot </label>
	</div>

	<button type="submit" class="border-primary border border-opacity-50 p-4 focus:border-teal-500 focus:outline-none"
		>send</button
	>
</form>
