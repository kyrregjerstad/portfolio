<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';

	import { fileUploadSchema } from './fileUploadSchema';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let expiryTime = $state(24); // Default 24 hours

	let expiryOptions = $state([
		{ value: 1, label: '1 hour' },
		{ value: 24, label: '24 hours' },
		{ value: 168, label: '1 week' },
	]);

	const { form, enhance, errors, submitting } = superForm(data.form, {
		validators: zodClient(fileUploadSchema),
	});

	const file = fileProxy(form, 'file');
</script>

<div class="container mx-auto max-w-2xl py-8">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold">Temporary File Upload</h1>
			<p class="text-muted-foreground mt-2">
				Upload files that will be automatically deleted after the specified time.
			</p>
		</div>

		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance class="space-y-4">
			<div>
				<Label for="file">File</Label>
				<input id="file" name="file" type="file" bind:files={$file} class="mt-1" accept="*/*" />
				{#if $errors.file}
					<p class="text-red-500">{$errors.file}</p>
				{/if}
			</div>

			<div>
				<Label for="expiry">Delete after</Label>
				<select id="expiry" name="expiryHours" bind:value={$form.expiryHours} class="mt-1 text-black">
					{#each expiryOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				{#if $errors.expiryHours}
					<p class="text-red-500">{$errors.expiryHours}</p>
				{/if}
			</div>

			<Button type="submit" disabled={!file || $submitting} class="w-full bg-zinc-500 ">Upload File</Button>
		</form>
	</div>
</div>
