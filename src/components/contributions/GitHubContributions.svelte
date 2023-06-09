<script>
	// @ts-nocheck

	import * as THREE from "three";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
	import gsap from "gsap";
	import { scrollPosition } from "$stores/scroll";
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	export let data;

	$: ({ totalContributions } = data.user.contributionsCollection.contributionCalendar);

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

		const scene = new THREE.Scene();

		let maxContributions = 0;
		weeks.forEach((week) => {
			week.contributionDays.forEach((day) => {
				if (day.contributionCount > maxContributions) {
					maxContributions = day.contributionCount;
				}
			});
		});

		const maxHeight = 10; // This can be any value you choose
		const minHeight = 0; // This can be any value you choose
		const initialHeight = 1;

		// Create a parent group for the cubes
		const cubeGroup = new THREE.Group();
		const material = new THREE.MeshStandardMaterial();

		const contributionCap = 40; // Set this to the maximum contribution count you want to allow

		weeks.forEach((week, weekIndex) => {
			week.contributionDays.forEach((day, dayIndex) => {
				let contributionCount = day.contributionCount;
				if (contributionCount > contributionCap) {
					contributionCount = contributionCap; // Apply the cap
				}

				const scaledContributionCount =
					((contributionCount / contributionCap) * (maxHeight - minHeight) + minHeight) * 4;

				const geometry = new THREE.BoxGeometry(1, scaledContributionCount, 1);

				const cube = new THREE.Mesh(geometry, material.clone());

				cube.userData.scaledContributionCount = scaledContributionCount;

				const lightness = (day.contributionCount / maxContributions) * 0.6 + 0.03;

				cube.material.color.setHSL(0.3, 1, lightness);

				// Enable shadow casting and receiving for the cube
				cube.castShadow = true;
				cube.receiveShadow = true;

				// Arrange cubes in a grid with gaps
				const gapSize = 2;
				cube.position.x = dayIndex * gapSize;
				cube.position.z = weekIndex * gapSize;

				cube.position.y += scaledContributionCount / 2;

				// console.log(cube.position.y);
				// cube.position.y = 0;

				cube.scale.y = initialHeight;

				cubeGroup.add(cube);
			});
		});

		// Add the cubeGroup to the scene
		cubeGroup.position.set(80, -10, 0); // Center the cubeGroup
		cubeGroup.rotation.z = Math.PI / 2;
		cubeGroup.rotation.y = -Math.PI / 2;

		const wrapper = new THREE.Group();

		wrapper.add(cubeGroup);
		scene.add(wrapper);

		function animateCubes() {
			const initialHeight = 0; // Starting height of the cubes
			let duration = 2.5; // Animation duration in seconds

			cubeGroup.children.forEach((cube, index) => {
				const targetHeight = cube.scale.y; // Target height is the cube's current height
				const delay = index * 0.005; // Add a small delay between each cube
				duration = index * 0.01;
				cube.scale.y = initialHeight;
				cube.position.y = initialHeight / 2;

				// Animate the cube's height to the target height using GSAP
				gsap.fromTo(cube.scale, { y: initialHeight }, { y: targetHeight, duration, delay, ease: "power2.out" });
				gsap.fromTo(
					cube.position,
					{ y: initialHeight / 2 },
					{ y: (targetHeight * cube.userData.scaledContributionCount) / 2, duration, delay, ease: "power2.out" }
				);
			});
		}

		animateCubes();

		const ambientLight = new THREE.AmbientLight(0xffffff, 2);

		scene.add(ambientLight);

		const sizes = {
			width: container.offsetWidth,
			height: container.offsetHeight
		};

		window.addEventListener("resize", () => {
			sizes.width = container.offsetWidth;
			sizes.height = container.offsetHeight;

			// Update camera
			const aspectRatio = sizes.width / sizes.height;
			camera.left = -aspectRatio * 10; // Multiply by the half of the frustum size (change as needed)
			camera.right = aspectRatio * 10; // Multiply by the half of the frustum size (change as needed)
			camera.top = 10; // Half of the frustum size (change as needed)
			camera.bottom = -10; // Half of the frustum size (change as needed)

			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});

		/**
		 * Camera
		 */
		// Base camera

		const camera = new THREE.OrthographicCamera(
			sizes.width / -10,
			sizes.width / 10,
			sizes.height / 10,
			sizes.height / -10,
			0.1,
			1000
		);

		camera.position.set(0, 0, -50);

		scene.add(camera);

		scrollYTweened.subscribe((scrollY) => {
			// Change rotation of the cubeGroup or camera based on scrollY

			if (scrollY > 300 && scrollY < 600) {
				wrapper.rotation.x = (scrollY - 300) / 350;
				wrapper.rotation.z = (scrollY - 300) / 2000;

				wrapper.position.y = -(scrollY - 300) / 50;
			}
		});

		// Controls
		const controls = new OrbitControls(camera, canvas);
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableRotate = false;
		controls.enableDamping = true;

		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setClearColor(0x000000, 0);

		const tick = () => {
			// Update controls
			controls.update();

			// Render
			renderer.render(scene, camera);

			// Call tick again on the next frame
			window.requestAnimationFrame(tick);
		};

		tick();
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
