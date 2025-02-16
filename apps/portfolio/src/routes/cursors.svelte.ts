import { browser } from '$app/environment';
import PartySocket from 'partysocket';
import { SvelteMap } from 'svelte/reactivity';

type Position = { x: number; y: number };

type Cursor = {
	x: number;
	y: number;
	connectionId: string;
};

type User = {
	presence: Cursor;
};

export class CursorTracker {
	private socket: PartySocket | null = null;
	private cursors = new SvelteMap<string, Cursor>();
	private throttleTimeout: number | null = null;
	private host: string;

	constructor(host: string) {
		this.host = host;
	}

	connect() {
		if (!browser) return;

		this.socket = new PartySocket({
			host: this.host,
			room: 'cursors',
		});

		this.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'sync') {
				this.cursors.clear();
				Object.entries<User>(data.users).forEach(([id, user]) => {
					this.cursors.set(id, user.presence);
				});
			} else if (data.type === 'changes') {
				// Update presence
				Object.entries(data.presence).forEach(([id, presence]) => {
					this.cursors.set(id, presence as Cursor);
				});
				// Remove disconnected users
				data.remove.forEach((id: string) => this.cursors.delete(id));
			}
		});
	}

	updatePosition(position: Position) {
		if (!this.socket) return;

		// Throttle updates to 60fps
		if (this.throttleTimeout) return;
		this.throttleTimeout = window.setTimeout(() => {
			this.throttleTimeout = null;
		}, 1000 / 60);

		const cursor: Cursor = {
			...position,
			connectionId: this.socket.id,
		};

		this.socket.send(JSON.stringify(cursor));
	}

	getCursors() {
		return this.cursors;
	}

	getCurrentId() {
		return this.socket?.id;
	}

	cleanup() {
		this.socket?.close();
		this.socket = null;
		this.cursors.clear();
		if (this.throttleTimeout) {
			clearTimeout(this.throttleTimeout);
			this.throttleTimeout = null;
		}
	}
}
