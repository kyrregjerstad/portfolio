import { browser } from '$app/environment';

export class ParticleLocalStore<T> {
	value = $state<T>() as T;
	key = '';

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = this.deserialize(item);
		}

		$effect(() => {
			if (browser) {
				localStorage.setItem(this.key, this.serialize(this.value));
			}
		});
	}

	serialize(value: T): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): T {
		return JSON.parse(item);
	}
}

export function particleStore<T>(key: string, value: T) {
	return new ParticleLocalStore(key, value);
}

export interface ParticleSettings {
	trailIntensity: number;
	cursorRadius: number;
	cursorForce: number;
	numberOfParticles: number;
	speedMultiplier: number;
	turbulence: number;
	movementPattern: 'rain' | 'spiral' | 'drift' | 'waves' | 'converge';
	cursorInteraction: boolean;
	staticMode: boolean;
	angle: number;
	particleSize: {
		min: number;
		max: number;
	};
	particleShape: 'circle' | 'square' | 'triangle';
	colorOverlay: {
		enabled: boolean;
		color: string;
		intensity: number; // 0-1 range to control blend
	};
}
