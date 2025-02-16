<script lang="ts">
	import { onMount } from 'svelte';
	import CursorBlob from './CursorBlob.svelte';
	import { PUBLIC_PARTYKIT_URL } from '$env/static/public';
	import { CursorTracker } from '../routes/cursors.svelte';

	const tracker = new CursorTracker(PUBLIC_PARTYKIT_URL);

	function updateCursor(event: MouseEvent) {
		const pageContent = document.querySelector('#page-content');
		if (!pageContent) return;

		tracker.updatePosition({
			x: event.clientX,
			y: event.clientY + pageContent.scrollTop,
		});
	}

	onMount(() => {
		tracker.connect();
		return () => tracker.cleanup();
	});

	const cursors = tracker.getCursors();
</script>

<svelte:window on:mousemove={updateCursor} />

{#each [...cursors.entries()] as [id, cursor]}
	{#if id !== tracker.getCurrentId()}
		<CursorBlob position={cursor} />
	{/if}
{/each}
