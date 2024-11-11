<script lang="ts">
	import { particleStore, type ParticleSettings } from '@/lib/stores/particleStore.svelte';
	import { onDestroy } from 'svelte';
	import ParticleControls from './ParticleControls.svelte';
	import { createParticleSystem, getImageData } from './particleSetup';
	import { ParticleSystem } from './ParticleSystem';
	import { X } from 'lucide-svelte';

	let canvas = $state<HTMLCanvasElement | null>(null);
	let particleSystem: ParticleSystem | null = null;
	let mouseX = $state(0);
	let mouseY = $state(0);
	let innerWidth = $state(0);
	let aspectRatio = $state(0);

	let showControls = $state(true);

	const settings = particleStore<ParticleSettings>('particle-settings', {
		numberOfParticles: 10_000,
		trailIntensity: 0.05,
		speedMultiplier: 0.5,
		cursorRadius: 100,
		cursorForce: 0.3,
		turbulence: 0.5,
		movementPattern: 'rain',
		angle: 0,
		cursorInteraction: false,
		staticMode: false,
		particleSize: {
			min: 0.5,
			max: 1.5,
		},
		particleShape: 'circle',
		colorOverlay: {
			enabled: false,
			color: '#ffffff',
			intensity: 0.5,
		},
	});

	function updateParticleSystem(fullReinitialize: boolean = false) {
		if (!canvas) return;

		if (fullReinitialize) {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			if (particleSystem) {
				particleSystem.stop();
			}

			const imageData = getImageData(canvas, image);

			if (!imageData) {
				throw new Error('Failed to get image data');
			}

			particleSystem = createParticleSystem(canvas, settings.value, imageData);
		} else {
			particleSystem?.updateSettings({
				trailIntensity: settings.value.trailIntensity,
				speedMultiplier: settings.value.speedMultiplier,
				cursorInteraction: settings.value.cursorInteraction,
				cursorRadius: settings.value.cursorRadius,
				cursorForce: settings.value.cursorForce,
				staticMode: settings.value.staticMode,
				colorOverlay: settings.value.colorOverlay,
				particleConfig: {
					turbulence: settings.value.turbulence,
					minSize: settings.value.particleSize.min,
					maxSize: settings.value.particleSize.max,
					shape: settings.value.particleShape,
				},
			});
		}
	}

	const image = new Image();
	image.crossOrigin = 'anonymous';
	image.src = '/images/particles/3.jpg';

	// Calculate aspect ratio when image loads
	image.onload = () => {
		aspectRatio = image.height / image.width;

		if (canvas) {
			canvas.width = innerWidth;
			canvas.height = Math.floor(innerWidth * aspectRatio);
			updateParticleSystem(true); // Initialize the particle system when image loads
		}
	};

	function handleMouseMove(event: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
		particleSystem?.updateMousePosition(mouseX, mouseY);
	}

	onDestroy(() => {
		particleSystem?.stop();
	});
</script>

<svelte:window bind:innerWidth on:mousemove={handleMouseMove} />

<section class="flex min-h-[calc(100dvh_-_5rem)] flex-col items-center gap-4">
	<a href="/" class="flex items-center gap-2 self-end opacity-50 transition-opacity hover:scale-110 hover:opacity-100">
		<X class="size-10 sm:size-6" />
		<span class="sr-only">home</span>
	</a>
	<div class="flex w-full max-w-screen-md flex-col gap-4">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<canvas bind:this={canvas} class="h-auto w-full" />
		<ParticleControls {settings} bind:showControls onUpdate={updateParticleSystem} />
	</div>
</section>
