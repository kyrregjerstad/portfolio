<script lang="ts">
	import { cn } from '@/lib/utils';
	import { Spring } from 'svelte/motion';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { HeartSFX } from './heart-sfx.svelte';

	type Props = HTMLButtonAttributes & {
		isMaxCountReached: boolean;
		totalLikesByUser: number;
	};

	let { isMaxCountReached, totalLikesByUser, ...htmlButtonProps }: Props = $props();

	let isHovering = $state(false);
	let isDown = $state(false);
	let rotate = $state(0);
	let buttonRef = $state<HTMLButtonElement | null>(null);
	let isTouchDevice = $state(false);
	let heartSFX = $state(new HeartSFX());

	let avoidanceOffset = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });

	function updateAvoidance(event: MouseEvent) {
		if (!isMaxCountReached || !buttonRef) return;

		const rect = buttonRef.getBoundingClientRect();
		const buttonCenterX = rect.left + rect.width / 2;
		const buttonCenterY = rect.top + rect.height / 2;

		// Calculate vector from mouse to button center
		const dx = event.clientX - buttonCenterX;
		const dy = event.clientY - buttonCenterY;

		// Calculate distance
		const distance = Math.sqrt(dx * dx + dy * dy);
		const avoidanceRadius = 40; // Distance at which button starts avoiding

		if (distance < avoidanceRadius) {
			// Calculate avoidance strength (stronger when closer)
			const strength = (1 - distance / avoidanceRadius) * 30;

			// Move in the opposite direction of the mouse
			avoidanceOffset.target = {
				x: (-dx / distance) * strength,
				y: (-dy / distance) * strength,
			};
		} else {
			// Gradually return to center when mouse is far
			avoidanceOffset.target = {
				x: avoidanceOffset.current.x * 0.8,
				y: avoidanceOffset.current.y * 0.8,
			};
		}
	}

	$effect(() => {
		if (isMaxCountReached) {
			document.addEventListener('mousemove', updateAvoidance);
		} else {
			document.removeEventListener('mousemove', updateAvoidance);
			avoidanceOffset.target = { x: 0, y: 0 };
		}

		return () => {
			document.removeEventListener('mousemove', updateAvoidance);
		};
	});

	$effect(() => {
		// Check if device supports touch events
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	});

	function randomRotate() {
		return Math.random() * 45 - 22.5;
	}

	function handleMouseDown(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (isTouchDevice) return; // Skip for touch devices
		rotate = randomRotate();
		htmlButtonProps.onmousedown?.(event);

		// Reset states after animation
		setTimeout(() => {
			isDown = false;
			if (isTouchDevice) {
				isHovering = false;
			}
		}, 200);

		heartSFX.increment(totalLikesByUser);
	}

	function handleTouchStart(event: TouchEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault(); // Prevent double-firing on some devices
		isHovering = true; // Show hover state briefly on touch
		htmlButtonProps.ontouchstart?.(event);

		// Reset states after animation
		setTimeout(() => {
			isDown = false;
			if (isTouchDevice) {
				isHovering = false;
			}
		}, 200);

		heartSFX.increment(totalLikesByUser);
	}

	function handleMouseUp() {
		if (isTouchDevice) return;
		setTimeout(() => {
			isDown = false;
		}, 200);
	}

	function handleMouseEnter() {
		if (!isTouchDevice) {
			rotate = randomRotate();
			isHovering = true;
		}
	}

	function handleMouseLeave() {
		if (!isTouchDevice) {
			isHovering = false;
			isDown = false;
		}
	}

	function handleTouchEnd() {
		setTimeout(() => {
			isHovering = false;
			isDown = false;
		}, 200);
	}
</script>

<div style={`transform: translate(${avoidanceOffset.current.x}px, ${avoidanceOffset.current.y}px);`}>
	<button
		bind:this={buttonRef}
		{...htmlButtonProps}
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		class={cn(
			'z-20 transform select-none transition-all duration-200',
			isHovering && !isMaxCountReached && `animate-scale-bounce random-rotate`,
			{
				'rotate-0 scale-90': isDown && !isMaxCountReached,
			},
			{
				'pointer-events-none': isMaxCountReached,
			}
		)}
		style={`--rotate: ${rotate}deg;`}>❤️</button
	>
</div>

<style>
	.random-rotate {
		transform: rotate(var(--rotate)) scale(1.5);
	}
</style>
