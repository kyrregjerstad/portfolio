<script lang="ts">
	import { cn } from '@/lib/utils';
	import { Spring, Tween } from 'svelte/motion';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { HeartSFX } from './heart-sfx.svelte';
	import { MAX_LIKES_PER_USER } from '@/lib/config';
	import { cubicOut } from 'svelte/easing';
	import posthog from 'posthog-js';

	type Props = HTMLButtonAttributes & {
		isMaxCountReached: boolean;
		totalLikesByUser: number;
		projectTitle: string;
	};

	let { isMaxCountReached, totalLikesByUser, projectTitle, ...htmlButtonProps }: Props = $props();

	let isHovering = $state(false);
	let isDown = $state(false);
	let rotate = $state(0);
	let buttonRef = $state<HTMLButtonElement | null>(null);
	let isTouchDevice = $state(false);
	let heartSFX = $state(new HeartSFX());
	let fillPercentage = $derived(Math.min((totalLikesByUser / MAX_LIKES_PER_USER) * 100, 100));
	let gradientStop = new Tween(100, { duration: 1000, easing: cubicOut });
	let avoidanceOffset = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });

	$effect(() => {
		gradientStop.target = (100 - fillPercentage) / 100;
	});

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
		posthog.capture('heart_button_click', {
			projectTitle: projectTitle,
		});
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
		posthog.capture('heart_button_click', {
			projectTitle: projectTitle,
		});
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
			'z-20 transform select-none transition-all ',
			isHovering && !isMaxCountReached && `animate-scale-bounce random-rotate`,
			{
				'rotate-0 scale-90': isDown && !isMaxCountReached,
			},
			{
				'pointer-events-none': isMaxCountReached || htmlButtonProps.disabled,
			}
		)}
		style={`--rotate: ${rotate}deg;`}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-heart"
		>
			<defs>
				<linearGradient id="heartFill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stop-color="transparent" />
					<stop offset={gradientStop.current} stop-color="transparent" />
					<stop offset={gradientStop.current} stop-color="hsl(60, 100%, 95%)" />
					<stop offset="1" stop-color="hsl(60, 100%, 95%)" />
				</linearGradient>
			</defs>
			<path
				d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
				fill="url(#heartFill)"
				style="transition: all 0.3s ease"
				stroke="hsl(60, 100%, 95%)"
			/>
		</svg>
	</button>
</div>

<style>
	.random-rotate {
		transform: rotate(var(--rotate)) scale(1.5);
	}
</style>
