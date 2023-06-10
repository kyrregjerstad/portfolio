<script>
	// @ts-nocheck

	import * as THREE from "three";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
	import { scrollPosition } from "$stores/scroll";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	import { ContributionData } from "$lib/three/ContributionData";

	import { CubeGridCreator } from "$lib/three/CubeGridCreator";
	import { CubeAnimator } from "$lib/three/CubeAnimator";
	import { CameraSetup } from "$lib/three/CameraSetup";
	import { LightingSetup } from "$lib/three/LightingSetup";
	import { ResizeHandler } from "$lib/three/ResizeHandler";
	import { Renderer } from "$lib/three/Renderer";
	import { SceneSetup } from "$lib/three/SceneSetup";

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

		const sceneSetupConfig = {
			data: data,
			maxHeight: 10,
			minHeight: 0,
			initialHeight: 1,
			contributionCap: 40,
			canvas,
			container
		};

		const sceneSetup = new SceneSetup(sceneSetupConfig);
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

		// const tick = () => {
		// 	controls.update();
		// 	renderer.render(sceneSetup.scene, camera);
		// 	window.requestAnimationFrame(tick);
		// };

		// tick();
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
