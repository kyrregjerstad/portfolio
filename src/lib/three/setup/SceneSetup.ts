import * as THREE from "three";
import type { CameraSetup } from "./CameraSetup";
import { LightingSetup } from "./LightingSetup";
import { CubeAnimator } from "../animation/CubeAnimator";
import type { CubeGrid } from "../objects/CubeGrid";
import type { ResizeHandler } from "./ResizeHandler";
import type { Renderer } from "./Renderer";
import type { Initializable } from "../types";
import { ScrollObserver } from "./ScrollObserver";
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
	#config: SceneConfig;
	#scene: THREE.Scene;
	#resizeHandler: ResizeHandler;
	#cubeGrid: CubeGrid;
	#renderer: Renderer;
	#cameraSetup: CameraSetup;
	#lightingSetup: LightingSetup;

	#cubeAnimator!: CubeAnimator;
	#scrollObserver: ScrollObserver;

	constructor(
		config: SceneConfig,
		resizeHandler: ResizeHandler,
		cubeGrid: CubeGrid,
		renderer: Renderer,
		cameraSetup: CameraSetup
	) {
		this.#config = config;
		this.#scene = new THREE.Scene();
		this.#resizeHandler = resizeHandler;
		this.#cubeGrid = cubeGrid;
		this.#renderer = renderer;
		this.#cameraSetup = cameraSetup;
		this.#lightingSetup = new LightingSetup(this.#scene);

		this.#scrollObserver = new ScrollObserver({
			target: this.#config.canvas,
			callback: () => this.#cubeAnimator.rotate(),
			rootMargin: "0px 0px -25% 0px"
		});
	}

	#handleResize() {
		window.addEventListener("resize", () => {
			this.#renderer.setSize(this.#resizeHandler.sizes);
			this.#cameraSetup.setAspectRatio(this.#resizeHandler.sizes);
		});
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

		this.#cubeAnimator = new CubeAnimator({
			group: this.#cubeGrid.cubeGroup,
			initialHeight: this.#config.initialHeight
		});

		this.#scene.add(this.#cubeGrid.cubeGroup);

		this.#handleResize();

		this.#renderer.start(this.#scene, this.#cameraSetup.instance);
		this.#scrollObserver.observe();
	}
}
