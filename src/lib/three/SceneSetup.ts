import * as THREE from "three";
import { LightingSetup } from "./LightingSetup";
import type { CameraSetup } from "./CameraSetup";
import type { ResizeHandler } from "./ResizeHandler";
import type { Renderer } from "./Renderer";
import type { GitHubData } from "$lib/types/gitHubTypes";
import type { CubeGrid } from "./CubeGrid";
import type { Initializable } from "./types";
import { CubeAnimator } from "./CubeAnimator";

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
	#config: SceneConfig;
	#scene: THREE.Scene;
	#cubeGroup: THREE.Group;
	#resizeHandler: ResizeHandler;
	#cubeGrid: CubeGrid;
	#renderer: Renderer;
	#cameraSetup: CameraSetup;
	#lightingSetup: LightingSetup;

	#cubeAnimator: CubeAnimator;

	constructor(
		config: SceneConfig,
		resizeHandler: ResizeHandler,
		cubeGrid: CubeGrid,
		renderer: Renderer,
		cameraSetup: CameraSetup
	) {
		this.#config = config;
		this.#scene = new THREE.Scene();
		this.#cubeGroup = new THREE.Group();
		this.#resizeHandler = resizeHandler;
		this.#cubeGrid = cubeGrid;
		this.#renderer = renderer;
		this.#cameraSetup = cameraSetup;
		this.#lightingSetup = new LightingSetup(this.#scene);

		this.#cubeAnimator = new CubeAnimator({
			group: this.#cubeGroup,
			initialHeight: config.initialHeight
		});
	}

	#handleResize() {
		window.addEventListener("resize", () => {
			this.#renderer.setSize(this.#resizeHandler.sizes);
			this.#cameraSetup.setAspectRatio(this.#resizeHandler.sizes);
		});
	}

	#rotateCubeGroup() {
		const rotationSpeed = 0.001; // Adjust the rotation speed as desired

		this.#cubeGroup.rotation.x += rotationSpeed;
		this.#cubeGroup.rotation.y += rotationSpeed;
		this.#cubeGroup.rotation.z += rotationSpeed;
	}

	#startRotation() {
		const rotate = () => {
			this.#rotateCubeGroup();
			window.requestAnimationFrame(rotate);
		};

		rotate();
	}

	init() {
		const initializables: Initializable[] = [
			this.#resizeHandler,
			this.#cubeGrid,
			this.#renderer,
			this.#cameraSetup,
			this.#lightingSetup
		];

		initializables.forEach((item) => item.init());

		this.#scene.add(this.#cubeGrid.cubeGroup);
		this.#cubeAnimator.animate();

		this.#handleResize();

		this.#renderer.start(this.#scene, this.#cameraSetup.instance);
		this.#startRotation();
	}
}
