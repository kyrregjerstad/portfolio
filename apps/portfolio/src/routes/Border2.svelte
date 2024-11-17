<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;

		updatePath();
		window.addEventListener('resize', updatePath, { passive: true });
	});

	function updatePath() {
		const container = document.querySelector('.border-container');
		const rect = container!.getBoundingClientRect();
		const path = document.getElementById('border-path');

		// Create path starting from top-left, going clockwise
		const pathData = `
          M ${rect.left} ${rect.top}
          L ${rect.right} ${rect.top}
          L ${rect.right} ${rect.bottom}
          L ${rect.left} ${rect.bottom}
          L ${rect.left} ${rect.top}
      `;

		path?.setAttribute('d', pathData);

		// Calculate the total length of the path
		const length = path?.getTotalLength();
		document.documentElement.style.setProperty('--border-length', length);
	}
</script>

<div class="border-container">
	<div>
		{@render children()}
	</div>
</div>
<div class="svg-container">
	<svg width="100%" height="100%" preserveAspectRatio="none">
		<path class="border-path stroke-muted-foreground fill-none stroke-2" id="border-path" />
	</svg>
</div>

<style>
	.border-container {
		position: fixed;
		overflow-y: auto;
		inset: 25px;
		padding: 25px;
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
		stroke-dasharray: var(--border-length);
		stroke-dashoffset: var(--border-length);
		animation: draw-border 3.5s 500ms ease-in-out forwards;
	}

	@keyframes draw-border {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
