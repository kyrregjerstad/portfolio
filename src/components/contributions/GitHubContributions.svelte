<script>
	// @ts-nocheck

	import { scrollPosition } from "$stores/scroll";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { CameraSetup } from "$lib/three/CameraSetup";
	import { ResizeHandler } from "$lib/three/ResizeHandler";
	import { Renderer } from "$lib/three/Renderer";
	import { SceneSetup } from "$lib/three/SceneSetup";
	import { CubeGrid } from "$lib/three/CubeGrid";

	export let data;

	let totalContributions = 0;

	$: scrollY = $scrollPosition;

	let scrollYTweened = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});

	scrollPosition.subscribe((scrollY) => {
		scrollYTweened.set(scrollY);
	});

	$: weeks = data.user.contributionsCollection.contributionCalendar.weeks;

	onMount(() => {
		const canvas = document.querySelector("canvas.webgl");
		const container = document.querySelector(".canvas-wrapper");

		const config = {
			data: data,
			maxHeight: 5,
			minHeight: 1,
			initialHeight: 3,
			contributionCap: 200,
			canvas: canvas,
			container: container
		};

		const resizeHandler = new ResizeHandler(container);
		const cubeGrid = new CubeGrid(config);
		const renderer = new Renderer(resizeHandler, canvas);
		const cameraSetup = new CameraSetup(resizeHandler, 2.5);

		const sceneSetup = new SceneSetup(config, resizeHandler, cubeGrid, renderer, cameraSetup);

		sceneSetup.init();

		// scrollYTweened.subscribe((scrollY) => {
		// 	// Change rotation of the cubeGroup or camera based on scrollY

		// 	if (scrollY > 300 && scrollY < 600) {
		// 		wrapper.rotation.x = (scrollY - 300) / 350;
		// 		wrapper.rotation.z = (scrollY - 300) / 2000;

		// 		wrapper.position.y = -(scrollY - 300) / 50;
		// 	}
		// });

		// Animate cubes
		// const cubeAnimator = new CubeAnimator({
		// 	group: sceneSetup.cubeGroup,
		// 	initialHeight: 0
		// });
		// cubeAnimator.animate();
	});
</script>

<div class="canvas-wrapper">
	<h2>{totalContributions} contributions in the last year</h2>
	<canvas class="webgl" />
</div>

<style>
	.canvas-wrapper {
		width: 100%;
		height: 12rem;
		user-select: none;
		position: relative;
	}

	canvas {
		height: 100%;
	}

	h2 {
		font-size: 0.8rem;
		position: absolute;
		bottom: 0;
	}
</style>
