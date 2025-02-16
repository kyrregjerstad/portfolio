<script lang="ts">
	import { browser } from '$app/environment';
	import PartySocket from 'partysocket';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import CursorBlob from './CursorBlob.svelte';
	import { PUBLIC_PARTYKIT_URL } from '$env/static/public';

	type Cursor = {
		x: number;
		y: number;
		connectionId: string;
	};

	type User = {
		presence: Cursor;
	};

	const users = new SvelteMap<string, Cursor>();
	let socket = $state<PartySocket | null>(null);
	let throttleTimeout: number | null = null;

	function updateCursor(event: MouseEvent) {
		if (!socket) return;

		// Throttle updates to 60fps
		if (throttleTimeout) return;
		throttleTimeout = window.setTimeout(() => {
			throttleTimeout = null;
		}, 1000 / 60);

		const pageContent = document.querySelector('#page-content');
		if (!pageContent) return;

		const cursor: Cursor = {
			x: event.clientX,
			y: event.clientY + pageContent.scrollTop,
			connectionId: socket.id,
		};

		socket.send(JSON.stringify(cursor));
	}

	onMount(() => {
		if (!browser) return;

		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_URL,
			room: 'cursors',
		});

		socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'sync') {
				users.clear();
				Object.entries<User>(data.users).forEach(([id, user]) => {
					users.set(id, user.presence);
				});
			} else if (data.type === 'changes') {
				// Update presence
				Object.entries(data.presence).forEach(([id, presence]) => {
					users.set(id, presence as Cursor);
				});
				// Remove disconnected users
				data.remove.forEach((id: string) => users.delete(id));
			}
		});

		return () => {
			socket?.close();
		};
	});
</script>

<svelte:window on:mousemove={updateCursor} />

{#each [...users.entries()] as [id, cursor]}
	{#if id !== socket?.id}
		<CursorBlob position={cursor} />
	{/if}
{/each}
