<script lang="ts">
	import { Spring } from 'svelte/motion';

	let { innerWidth, innerHeight } = $state({ innerWidth: 0, innerHeight: 0 });
	let scrollY = $state(0);
	let blob = new Spring({ x: 0, y: 0, scale: 1 }, { stiffness: 0.001, damping: 0.09 });

	function updateBlobPosition(clientX: number, clientY: number) {
		const divide = 4;

		const centerX = innerWidth / 2;
		const centerY = innerHeight / 2;

		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;

		blob.target = {
			...blob.current,
			x: -deltaX / divide,
			y: -deltaY / divide,
		};
	}
</script>

<svelte:window
	on:mousemove|passive={({ clientX, clientY }) => {
		updateBlobPosition(clientX, clientY);
	}}
	on:mousedown={() => {
		blob.target = { ...blob.current, scale: 0.8 };
	}}
	on:mouseup={() => {
		blob.target = { ...blob.current, scale: 1 };
	}}
	bind:scrollY
	bind:innerWidth
	bind:innerHeight
/>

<div class="intro-animation">
	<div class="blobs-wrapper" style="--x: {blob.current.x}px; --y: {blob.current.y}px; --scale: {blob.current.scale}">
		<div
			class="blob"
			id="blob-1"
			style:--offsetX="{blob.current.x}px"
			style:--offsetY="{blob.current.y}px"
			style:--scale-min="0.5"
			style:--scale-max="1"
			style:--animation-duration="10s"
		>
			<div class="blob-inner"></div>
		</div>
		<div
			class="blob"
			id="blob-2"
			style:--offsetX="{blob.current.x * 0.2}px"
			style:--offsetY="{blob.current.y * 0.2}px"
			style:--scale-min="0.75"
			style:--scale-max="1.25"
			style:--animation-duration="8s"
		>
			<div class="blob-inner"></div>
		</div>
		<div
			class="blob"
			id="blob-3"
			style:--offsetX="{blob.current.x * 0.6}px"
			style:--offsetY="{blob.current.y * 0.6}px"
			style:--scale-min="1"
			style:--scale-max="1.25"
			style:--animation-duration="6s"
		>
			<div class="blob-inner"></div>
		</div>
	</div>
</div>

<style>
	.intro-animation {
		position: fixed;
		right: 20%;
		top: 33%;
		width: 350px;
		aspect-ratio: 1;
		z-index: 3;
		pointer-events: none;
		mix-blend-mode: lighten;
	}

	:global([data-firstVisit='true'] .intro-animation) {
		animation: intro 3s ease-in-out forwards;
	}

	.blobs-wrapper {
		--x: 0px;
		--y: 0px;
		--scale: 1;
		position: absolute;
		opacity: 0.1;

		transform: translate3d(var(--x), var(--y), 0) scale(var(--scale));
		filter: blur(20px);

		@media (min-width: 768px) {
			opacity: 0.5;
		}

		@media (min-width: 1024px) {
			opacity: 0.8;
		}
	}

	.blob {
		--animation-duration: 5s;

		position: absolute;
		filter: blur(20px);

		mix-blend-mode: overlay;
		opacity: 0.8;

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
			opacity: 0.8;
		}
		to {
			opacity: 0.4;
		}
	}

	@keyframes intro {
		0% {
			scale: 0;
			opacity: 0;
			translate: -200px 0%;
			animation-timing-function: ease-in-out;
		}

		40% {
			scale: 1;
			opacity: 0.9;
			translate: -80% 0%;
			animation-timing-function: ease-in-out;
		}

		50% {
			scale: 1;
			opacity: 0.9;
			translate: -80% 0%;
			animation-timing-function: ease-in-out;
		}

		100% {
			scale: 1;
			opacity: 1;
			translate: 0% 0%;
			animation-timing-function: ease-in-out;
		}
	}
</style>
