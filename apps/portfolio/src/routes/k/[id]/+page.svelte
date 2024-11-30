<script lang="ts">
	import { Card } from '@/lib/components/ui/card';
	import type { PageData } from './$types';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { Download } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const isImage = data.contentType?.startsWith('image/');
	const isPdf = data.contentType === 'application/pdf';
	const isText = data.contentType?.startsWith('text/');
	const isVideo = data.contentType?.startsWith('video/');
	const isAudio = data.contentType?.startsWith('audio/');

	// Format the file size nicely
	function formatFileSize(bytes: number) {
		if (bytes < 1024) return bytes + ' B';
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
		else return (bytes / 1073741824).toFixed(1) + ' GB';
	}

	function downloadFile() {
		const a = document.createElement('a');
		a.href = data.fileUrl;
		a.download = data.metadata.originalName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<div class="container mx-auto max-w-4xl py-8">
	<Card class="p-6">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">{data.metadata.originalName}</h1>
				<p class="text-muted-foreground text-sm">
					{formatFileSize(data.size)}
				</p>
			</div>
			<Button onclick={downloadFile} variant="outline">
				<Download class="mr-2 h-4 w-4" />
				Download
			</Button>
		</div>

		<div class="mt-6">
			{#if isImage}
				<img
					src={data.fileUrl}
					alt={data.metadata.originalName}
					class="max-h-[70vh] w-full rounded-lg object-contain"
				/>
			{:else if isPdf}
				<iframe src={data.fileUrl} title={data.metadata.originalName} class="h-[70vh] w-full rounded-lg"></iframe>
			{:else if isText}
				<pre class="bg-muted max-h-[70vh] overflow-auto rounded-lg p-4 font-mono">
                  <code>{data.content}</code>
              </pre>
			{:else if isVideo}
				<video controls class="max-h-[70vh] w-full rounded-lg">
					<source src={data.fileUrl} type={data.contentType} />
					Your browser does not support the video tag.
				</video>
			{:else if isAudio}
				<audio controls class="w-full">
					<source src={data.fileUrl} type={data.contentType} />
					Your browser does not support the audio tag.
				</audio>
			{:else}
				<div class="bg-muted rounded-lg p-8 text-center">
					<p class="text-muted-foreground">Preview not available for this file type</p>
				</div>
			{/if}
		</div>
	</Card>
</div>
