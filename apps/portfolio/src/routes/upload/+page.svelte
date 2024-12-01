<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { Card } from '@/lib/components/ui/card';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { fileUploadSchema } from './fileUploadSchema';

	let { data } = $props();

	let expiryOptions = $state([
		{ value: 1, label: '1 hour' },
		{ value: 24, label: '24 hours' },
		{ value: 168, label: '1 week' },
	]);

	const { form, enhance, errors, submitting, message } = superForm(data.form, {
		validators: zodClient(fileUploadSchema),
		onResult: ({ result }) => {
			// Clear the file input after successful upload
			if (result.type === 'success') {
			}
		},
	});

	const file = fileProxy(form, 'file');

	// Get the typed message
	let uploadedUrl = $derived($message?.url) as string | undefined;
</script>

<div class="container mx-auto max-w-2xl py-8">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold">Temporary File Upload</h1>
			<p class="text-muted-foreground mt-2">
				Upload files that will be automatically deleted after the specified time.
			</p>
		</div>

		<!-- Show success message and URL if available -->
		{#if $message}
			<Card class="relative rounded border p-4">
				<p>{$message.message}</p>
				{#if uploadedUrl}
					<div class="mt-2">
						<p class="font-semibold">File URL:</p>
						<a href={uploadedUrl} class="break-all text-blue-600 hover:text-blue-800">
							{uploadedUrl}
						</a>
					</div>
				{/if}
			</Card>
		{/if}

		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance class="space-y-4">
			<div>
				<label for="file">File</label>
				<input id="file" name="file" type="file" bind:files={$file} class="mt-1" accept="*/*" />
				{#if $errors.file}
					<p class="text-red-500">{$errors.file}</p>
				{/if}
			</div>

			<div>
				<label for="expiry">Delete after</label>
				<select id="expiry" name="expiryHours" bind:value={$form.expiryHours} class="mt-1 text-black">
					{#each expiryOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				{#if $errors.expiryHours}
					<p class="text-red-500">{$errors.expiryHours}</p>
				{/if}
			</div>

			<Button type="submit" disabled={!file || $submitting} class="w-full bg-zinc-500">
				{$submitting ? 'Uploading...' : 'Upload File'}
			</Button>
		</form>
	</div>
</div>
