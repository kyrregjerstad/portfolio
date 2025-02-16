import type * as Party from 'partykit/server';

type Cursor = {
	x: number;
	y: number;
	connectionId: string;
};

type User = {
	presence: Cursor;
};

const BROADCAST_INTERVAL = 1000 / 60; // 60fps
const STORAGE_KEY = 'cursors';

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	// Store pending updates in memory
	presence: { [id: string]: Cursor } = {};
	remove: string[] = [];
	lastBroadcast = 0;
	interval: ReturnType<typeof setInterval> | null = null;

	async onStart() {
		// Load existing cursors from storage
		const storedCursors = await this.room.storage.get<Record<string, Cursor>>(STORAGE_KEY);
		if (storedCursors) {
			this.presence = storedCursors;
		}
	}

	async onConnect(conn: Party.Connection) {
		// Send current state to new connection
		const users: Record<string, User> = {};

		for (const connection of this.room.getConnections()) {
			const cursor = this.presence[connection.id];
			if (cursor) {
				users[connection.id] = { presence: cursor };
			}
		}
		conn.send(JSON.stringify({ type: 'sync', users }));
	}

	async onMessage(message: string, sender: Party.Connection) {
		try {
			const cursor = JSON.parse(message) as Cursor;
			console.log('onMessage', cursor);
			// Queue presence update
			this.presence[sender.id] = cursor;
			// Save to storage
			await this.room.storage.put(STORAGE_KEY, this.presence);
			// Broadcast updates
			await this.broadcast();
		} catch (e) {
			console.error('Failed to parse cursor message:', e);
		}
	}

	async onClose(connection: Party.Connection) {
		this.remove.push(connection.id);
		delete this.presence[connection.id];
		// Update storage
		await this.room.storage.put(STORAGE_KEY, this.presence);
		await this.broadcast();
	}

	async broadcast() {
		const now = Date.now();
		const ago = now - this.lastBroadcast;

		if (ago >= BROADCAST_INTERVAL) {
			await this._broadcast();
		} else if (!this.interval) {
			this.interval = setInterval(async () => {
				await this._broadcast();
				if (this.interval) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}, BROADCAST_INTERVAL - ago);
		}
	}

	async _broadcast() {
		this.lastBroadcast = Date.now();

		// Don't broadcast if only one connection and it's just updating itself
		const connections = [...this.room.getConnections()];
		const presenceIds = new Set(Object.keys(this.presence));
		if (
			connections.length === 1 &&
			this.remove.length === 0 &&
			presenceIds.size === 1 &&
			presenceIds.has(connections[0].id)
		) {
			this.presence = {};
			return;
		}

		const update = {
			type: 'changes',
			presence: this.presence,
			remove: this.remove,
		};

		this.room.broadcast(JSON.stringify(update));
		this.presence = {};
		this.remove = [];
	}

	async onRequest(req: Party.Request): Promise<Response> {
		return new Response('Cursor tracking server is running');
	}
}

Server satisfies Party.Worker;
