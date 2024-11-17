import type { ParticleSettings } from '@/lib/stores/particleStore.svelte';
import { ParticleSystem } from './ParticleSystem';

export function createParticleSystem(
	canvas: HTMLCanvasElement,
	settings: ParticleSettings,
	imageData: ImageData
): ParticleSystem {
	const particleSystem = new ParticleSystem(canvas, {
		targetFPS: 60,
		trailIntensity: settings.trailIntensity,
		backgroundColor: 'rgb(0, 0, 0)',
		timeStep: 1,
		speedMultiplier: settings.speedMultiplier,
		cursorInteraction: settings.cursorInteraction,
		cursorRadius: settings.cursorRadius,
		cursorForce: settings.cursorForce,
		numberOfParticles: settings.numberOfParticles,
		staticMode: settings.staticMode,
		colorOverlay: settings.colorOverlay,
		particleConfig: {
			movementPattern: settings.movementPattern,
			angle: settings.angle,
			turbulence: settings.turbulence,
			minSize: settings.particleSize.min,
			maxSize: settings.particleSize.max,
			shape: settings.particleShape,
		},
	});

	particleSystem.initialize(imageData);
	particleSystem.start();

	return particleSystem;
}

export function getImageData(canvas: HTMLCanvasElement, image: HTMLImageElement): ImageData | null {
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	return imageData;
}
