<script lang="ts">
	import { type Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		padding?: number;
	};

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
	<div class="top border-element"></div>
	<div class="left border-element"></div>
	<div class="right border-element"></div>
	<div class="bottom border-element"></div>
	<div class="content bg-background">
		{@render children()}
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
		position: fixed;
		z-index: 40;
		background-image: radial-gradient(transparent 1px, #10100e 1px);
		background-color: transparent;
		background-size: 4px 4px;
		@apply backdrop-blur-sm;
	}

	.content {
		overflow: hidden;
		padding: calc(var(--padding) * 2);
	}

	.top,
	.bottom {
		inset-inline: 0;
		height: var(--padding);
	}

	.bottom {
		bottom: 0;
	}

	.left {
		width: var(--padding);
		top: var(--padding);
		bottom: var(--padding);
	}

	.right {
		top: var(--padding);
		bottom: var(--padding);
		width: var(--padding);
		right: 0;
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
