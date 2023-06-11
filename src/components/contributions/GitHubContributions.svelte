<script>
	// @ts-nocheck
	import { onMount } from "svelte";
	import { CameraSetup } from "$lib/three/setup/CameraSetup";
	import { ResizeHandler } from "$lib/three/setup/ResizeHandler";
	import { Renderer } from "$lib/three/setup/Renderer";
	import { SceneSetup } from "$lib/three/setup/SceneSetup";
	import { CubeGrid } from "$lib/three/objects/CubeGrid";

	export let data;

	$: totalContributions = data.user.contributionsCollection.contributionCalendar.totalContributions;

	onMount(() => {
		const canvas = document.querySelector("canvas.webgl");
		const container = document.querySelector(".canvas-wrapper");

		const config = {
			data: data,
			maxHeight: 10,
			minHeight: 1,
			initialHeight: 0.75,
			contributionCap: 50,
			canvas: canvas,
			container: container
		};

		const resizeHandler = new ResizeHandler(container);
		const cubeGrid = new CubeGrid(config);
		const renderer = new Renderer(resizeHandler, canvas);
		const cameraSetup = new CameraSetup(resizeHandler, 2.5);

		const sceneSetup = new SceneSetup(config, resizeHandler, cubeGrid, renderer, cameraSetup);

		sceneSetup.init();
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
