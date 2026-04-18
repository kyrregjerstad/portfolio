<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { submitContactForm } from '$lib/remote/contact.remote';
	import CustomToast from './CustomToast.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';

	const { fields } = submitContactForm;
</script>

<form
	id="contact"
	{...submitContactForm.enhance(async ({ form, submit }) => {
		try {
			await submit();
			if (submitContactForm.result?.success) {
				form.reset();
				toast.custom(CustomToast, {
					componentProps: {
						title: 'Success',
						message: `Roger that, I'll get back to you soon!`,
					},
				});
			}
		} catch {
			toast.custom(CustomToast, {
				componentProps: {
					title: 'Error',
					message: 'Failed to send message, please try again later.',
					error: true,
				},
			});
		}
	})}
	class="flex max-w-lg flex-col gap-4"
>
	<Input label="Name" placeholder="Your name" required {...fields.name.as('text')} issues={fields.name.issues()} />
	<Input
		label="Subject"
		placeholder="Subject"
		required
		{...fields.subject.as('text')}
		issues={fields.subject.issues()}
	/>
	<Input
		label="Email"
		placeholder="Your email"
		required
		{...fields.email.as('email')}
		issues={fields.email.issues()}
	/>
	<TextArea
		label="Message"
		placeholder="Your message"
		required
		rows={10}
		{...fields.message.as('text')}
		issues={fields.message.issues()}
	/>

	<!-- 🍯 honeypot 🤖 -->
	<div class="absolute opacity-0">
		<input {...fields.botCheck.as('checkbox')} tabindex={-1} />
		<label for={fields.botCheck.as('checkbox').name}> I'm not a robot </label>
	</div>

	<button
		type="submit"
		class="bg-background border-muted-foreground focus:border-accent-foreground focus:outline-accent-foreground border p-4 focus:outline-hidden"
		>send</button
	>
</form>
