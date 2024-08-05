<script lang="ts">
	import { spring } from 'svelte/motion';

	let { innerWidth, innerHeight } = $state({ innerWidth: 0, innerHeight: 0 });
	const blobX = spring(0, { stiffness: 0.001, damping: 0.09 });
	const blobY = spring(0, { stiffness: 0.001, damping: 0.09 });

	function updateBlobPosition(clientX: number, clientY: number) {
		const divide = 4;

		const centerX = innerWidth / 2;
		const centerY = innerHeight / 2;

		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;

		blobX.set(-deltaX / divide);
		blobY.set(-deltaY / divide);
	}
</script>

<svelte:window
	on:mousemove|passive={({ clientX, clientY }) => {
		updateBlobPosition(clientX, clientY);
	}}
	bind:innerWidth
	bind:innerHeight
/>

<div class="blobs-wrapper" style:--x="{$blobX}px" style:--y="{$blobY}px">
	<div class="blob" id="blob-1" style:--scale-min="0.95" style:--scale-max="1.15" style:--animation-duration="10s">
		<div class="blob-inner"></div>
	</div>
	<div
		class="blob"
		id="blob-2"
		style:--offsetX="{$blobX * 0.4}px"
		style:--offsetY="{$blobY * 0.4}px"
		style:--scale-min="0.9"
		style:--scale-max="1.3"
		style:--animation-duration="8s"
	>
		<div class="blob-inner"></div>
	</div>
	<div
		class="blob"
		id="blob-3"
		style:--offsetX="{$blobX * 0.8}px"
		style:--offsetY="{$blobY * 0.8}px"
		style:--scale-min="1"
		style:--scale-max="1.2"
		style:--animation-duration="6s"
	>
		<div class="blob-inner"></div>
	</div>
</div>

<style>
	.blobs-wrapper {
		--x: 0px;
		--y: 0px;
		position: absolute;
		right: 25%;
		top: 30%;
		opacity: 0.8;
		transform: translate3d(var(--x), var(--y), 0);
		filter: blur(20px);
		z-index: -1;
	}

	.blob {
		--animation-duration: 5s;

		position: absolute;
		filter: blur(20px);

		mix-blend-mode: overlay;
		animation:
			breathe var(--animation-duration) infinite alternate ease-in-out,
			move 20s infinite alternate ease-in-out,
			fade 10s var(--animation-duration) infinite alternate ease-in-out;
	}

	.blob-inner {
		aspect-ratio: 1;
		width: 350px;
	}

	#blob-1 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		background: linear-gradient(30deg, oklch(69% 0.286 360) 0%, oklch(50% 0.286 360) 100%);
	}

	#blob-2 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		transform: translate3d(var(--offsetX), var(--offsetY), 0);

		background: linear-gradient(60deg, oklch(50% 0.1 190) 0%, oklch(65.41% 0.111 202) 100%);
	}

	#blob-3 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		transform: translate3d(var(--offsetX), var(--offsetY), 0);
		background: linear-gradient(90deg, oklch(30% 0.2 220.24) 0%, oklch(30% 0.4 309) 100%);
	}

	@keyframes move {
		0% {
			translate3d: 0% 0% 0;
			border-radius: 60% 40% 30% 70% / 100% 85% 92% 74%;
		}
		50% {
			translate3d: -5% 15% -5%;
			border-radius: 20% 71% 47% 70% / 81% 15% 22% 54%;
			rotate: 41deg;
		}
		100% {
			translate3d: 0% -5% 0;
			border-radius: 100% 75% 92% 74% / 60% 80% 30% 70%;
			rotate: -120deg;
		}
	}

	@keyframes breathe {
		from {
			scale: var(--scale-min);
		}
		to {
			scale: var(--scale-max);
		}
	}

	@keyframes fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.5;
		}
	}
</style>
