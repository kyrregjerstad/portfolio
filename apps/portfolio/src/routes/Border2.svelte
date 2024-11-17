<script lang="ts">
	import { type Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		padding?: number;
	};

	let { children, padding = 25 }: Props = $props();

	let container: HTMLDivElement;
	let pathElement: SVGPathElement;
	let pathLength = $state(0);
	let pathData = $state('');

	function calculatePath(rect: DOMRect) {
		return `
			M ${rect.left} ${rect.top}
			L ${rect.right} ${rect.top}
			L ${rect.right} ${rect.bottom}
			L ${rect.left} ${rect.bottom}
			L ${rect.left} ${rect.top}
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
		// Use requestAnimationFrame to ensure the path has been rendered
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

<div class="border-container" bind:this={container} style:padding={`${padding}px`} style:inset={`${padding}px`}>
	<div>
		{@render children()}
	</div>
</div>

<div class="svg-container">
	<svg width="100%" height="100%" preserveAspectRatio="none">
		<path
			bind:this={pathElement}
			class="border-path stroke-muted-foreground fill-none stroke-2"
			d={pathData}
			style:--path-length={pathLength}
		/>
	</svg>
</div>

<style>
	.border-container {
		position: fixed;
		overflow-y: auto;
	}

	.svg-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.border-path {
		stroke-dasharray: var(--path-length);
		stroke-dashoffset: var(--path-length);
		animation: draw-border 3.5s 500ms ease-in-out forwards;
	}

	@keyframes draw-border {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
