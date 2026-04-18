<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '@/lib/components/ui/card';
	import { uploadFile } from '$lib/remote/upload.remote';

	const expiryOptions = [
		{ value: '1', label: '1 hour' },
		{ value: '24', label: '24 hours' },
		{ value: '168', label: '1 week' },
	] as const;

	const { fields } = uploadFile;
</script>

<div class="container mx-auto max-w-2xl py-8">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold">Temporary File Upload</h1>
			<p class="text-muted-foreground mt-2">
				Upload files that will be automatically deleted after the specified time.
			</p>
		</div>

		{#if uploadFile.result}
			<Card class="relative rounded border p-4">
				<p>{uploadFile.result.message}</p>
				{#if uploadFile.result.url}
					<div class="mt-2">
						<p class="font-semibold">File URL:</p>
						<a href={uploadFile.result.url} class="break-all text-blue-600 hover:text-blue-800">
							{uploadFile.result.url}
						</a>
					</div>
				{/if}
			</Card>
		{/if}

		<form {...uploadFile} enctype="multipart/form-data" class="space-y-4">
			<div>
				<label for={fields.file.as('file').name}>File</label>
				<input {...fields.file.as('file')} class="mt-1" accept="*/*" />
				{#each fields.file.issues() as issue}
					<p class="text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for={fields.expiryHours.as('select').name}>Delete after</label>
				<select {...fields.expiryHours.as('select')} class="mt-1 text-black">
					{#each expiryOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				{#each fields.expiryHours.issues() as issue (issue.message)}
					<p class="text-red-500">{issue.message}</p>
				{/each}
			</div>

			<Button type="submit" disabled={!!uploadFile.pending} class="w-full bg-zinc-500">
				{uploadFile.pending ? 'Uploading...' : 'Upload File'}
			</Button>
		</form>
	</div>
</div>
