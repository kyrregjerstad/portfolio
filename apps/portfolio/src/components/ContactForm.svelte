<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import type { ContactForm } from '$lib/schema/contactSchema';
	import CustomToast from './CustomToast.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';

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

<form id="contact" method="POST" use:enhance class="flex max-w-lg flex-col gap-4" action="/contact?/submitContactForm">
	<Input
		label="Name"
		name="name"
		type="text"
		placeholder="Your name"
		required
		bind:value={$formData.name}
		bind:error={$errors.name}
	/>
	<Input
		label="Subject"
		name="subject"
		type="text"
		placeholder="Subject"
		required
		bind:value={$formData.subject}
		bind:error={$errors.subject}
	/>

	<Input
		label="Email"
		name="email"
		type="email"
		placeholder="Your email"
		required
		bind:value={$formData.email}
		bind:error={$errors.email}
	/>

	<TextArea
		label="Message"
		name="message"
		placeholder="Your message"
		required
		rows={10}
		bind:value={$formData.message}
		bind:error={$errors.message}
	/>

	<!-- 🍯 honeypot 🤖 -->
	<div class="absolute opacity-0">
		<input type="checkbox" id="botCheck" name="botCheck" tabindex="-1" />
		<label for="botCheck"> I'm not a robot </label>
	</div>

	<button
		type="submit"
		class="bg-background border-muted-foreground focus:border-accent-foreground focus:outline-accent-foreground border p-4 focus:outline-hidden"
		>send</button
	>
</form>
