<script lang="ts">
	import { browser } from '$app/environment';
	import PartySocket from 'partysocket';
	import { onMount } from 'svelte';
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

	let users = $state<Record<string, User>>({});
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
				users = data.users;
			} else if (data.type === 'changes') {
				// Update presence
				for (const [id, presence] of Object.entries<Cursor>(data.presence)) {
					users[id] = { presence };
				}
				// Remove disconnected users
				for (const id of data.remove) {
					delete users[id];
				}
			}
		});

		return () => {
			socket?.close();
		};
	});
</script>

<svelte:window on:mousemove={updateCursor} />

{#each Object.entries(users) as [id, user], index}
	{#if id !== socket?.id}
		<CursorBlob position={user.presence} />
	{/if}
{/each}
