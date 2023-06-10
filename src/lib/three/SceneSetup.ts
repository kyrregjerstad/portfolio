import * as THREE from "three";
import { ContributionData } from "$lib/three/ContributionData";
import { CubeGridCreator } from "$lib/three/CubeGridCreator";
import { LightingSetup } from "./LightingSetup";
import { CameraSetup } from "./CameraSetup";
import { ResizeHandler } from "./ResizeHandler";
import { Renderer } from "./Renderer";
import type { GitHubData } from "$lib/types/gitHubTypes";

interface SceneConfig {
	data: GitHubData;
	maxHeight: number;
	minHeight: number;
	initialHeight: number;
	contributionCap: number;
	canvas: HTMLCanvasElement;
	container: HTMLElement;
}

export class SceneSetup {
	private config: SceneConfig;
	public scene: THREE.Scene;
	public cubeGroup: THREE.Group;
	private resizeHandler: ResizeHandler;

	constructor(config: SceneConfig) {
		this.config = config;
		this.scene = new THREE.Scene();
		this.cubeGroup = new THREE.Group();
		this.resizeHandler = new ResizeHandler(this.config.container);
	}

	init() {
		const contributionData = new ContributionData(this.config.data);
		const maxContributions = contributionData.getMaxContributions();
		const weeks = this.config.data.user.contributionsCollection.contributionCalendar.weeks;

		const cubeGridCreator = new CubeGridCreator();
		this.cubeGroup = cubeGridCreator.createGrid({
			maxContributions,
			contributionCap: this.config.contributionCap,
			maxHeight: this.config.maxHeight,
			minHeight: this.config.minHeight,
			initialHeight: this.config.initialHeight,
			weeks
		});

		// Add the cubeGroup to the scene
		this.cubeGroup.position.set(-50, -10, 0); // Center the cubeGroup
		this.cubeGroup.rotation.z = Math.PI / 2;
		this.cubeGroup.rotation.y = Math.PI / 2;
		this.scene.add(this.cubeGroup);

		// Lighting
		const lightingSetup = new LightingSetup(this.scene);
		lightingSetup.configureAmbientLight();

		// Camera Setup
		const cameraSetup = new CameraSetup(this.resizeHandler, 3);
		const camera = cameraSetup.instance;

		// Renderer Setup
		const rendererObj = new Renderer(this.resizeHandler, this.config.canvas);
		const renderer = rendererObj.instance;

		// Resizing event listener
		window.addEventListener("resize", () => {
			rendererObj.setSize(this.resizeHandler.sizes);
			cameraSetup.setAspectRatio(this.resizeHandler.sizes);
		});

		// Animation
		const tick = () => {
			// Render
			renderer.render(this.scene, camera);

			// Call tick again on the next frame
			window.requestAnimationFrame(tick);
		};

		tick();
	}
}
