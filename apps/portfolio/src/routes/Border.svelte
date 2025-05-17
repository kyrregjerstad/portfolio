<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		padding?: number;
	};
	import Footer from '@/components/Footer.svelte';

	let { children, padding = 32 }: Props = $props();

	let container: HTMLDivElement;
	let pathElement: SVGPathElement;
	let pathLength = $state(0);
	let pathData = $state('');

	function calculatePath(rect: DOMRect) {
		const offset = padding;
		return `
			M ${offset} ${offset}
			L ${rect.width - offset} ${offset}
			L ${rect.width - offset} ${rect.height - offset}
			L ${offset} ${rect.height - offset}
			L ${offset} ${offset}
		`;
	}

	function updatePath() {
		const rect = container?.getBoundingClientRect();
		if (!rect) return;
		pathData = calculatePath(rect);
	}

	// Update path length whenever pathData changes
	$effect(() => {
		if (!pathElement || !pathData) return;
		requestAnimationFrame(() => {
			pathLength = pathElement.getTotalLength();
		});
	});

	// Update path when component mounts and on window resize
	$effect(() => {
		if (!container || !pathElement) return;

		updatePath();
		const resizeObserver = new ResizeObserver(() => {
			updatePath();
		});
		resizeObserver.observe(container);

		return () => resizeObserver.disconnect();
	});
</script>

<div class="h-dvh w-full overflow-auto" bind:this={container} style="--padding: {padding}px">
	<div class="border-element fixed inset-x-0 top-0" style="height: var(--padding)"></div>
	<div
		class="border-element fixed left-0"
		style="top: var(--padding); bottom: var(--padding); width: var(--padding)"
	></div>
	<div
		class="border-element fixed right-0"
		style="top: var(--padding); bottom: var(--padding); width: var(--padding)"
	></div>
	<div class="border-element fixed inset-x-0 bottom-0" style="height: var(--padding)"></div>

	<div class="bg-background h-dvh overflow-auto" id="page-content">
		{@render children()}
		<Footer />
	</div>

	<div class="pointer-events-none fixed inset-0 z-50">
		<svg width="100%" height="100%" preserveAspectRatio="none">
			<path
				bind:this={pathElement}
				class="border-path stroke-muted-foreground fill-none"
				d={pathData}
				style:--path-length={pathLength}
				stroke-width="2"
			/>
		</svg>
	</div>
</div>

<style>
	.border-element {
		background-image: radial-gradient(transparent 1px, #10100e 1px);
		background-size: 4px 4px;
		@apply z-40 bg-transparent backdrop-blur-sm;
	}

	.border-path {
		stroke-dasharray: var(--path-length);
		stroke-dashoffset: var(--path-length);
		animation: draw-border 3.5s cubic-bezier(0.4, 0, 0.35, 1) forwards;
	}

	@keyframes draw-border {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
