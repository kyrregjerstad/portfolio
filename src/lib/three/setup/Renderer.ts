import type { ResizeHandler } from "./ResizeHandler";
import * as THREE from "three";
import type { Initializable } from "../types";

export class Renderer implements Initializable {
	#resizeHandler: ResizeHandler;
	#renderer: THREE.WebGLRenderer;

	constructor(resizeHandler: ResizeHandler, canvas: HTMLCanvasElement) {
		this.#resizeHandler = resizeHandler;
		this.#renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true
		});
	}

	setSize(sizes: { width: number; height: number }) {
		this.#renderer.setSize(sizes.width, sizes.height);
	}

	get instance() {
		return this.#renderer;
	}

	start(scene: THREE.Scene, camera: THREE.Camera) {
		const render = () => {
			this.#renderer.render(scene, camera);
			window.requestAnimationFrame(render);
		};

		render();
	}

	init() {
		this.setSize(this.#resizeHandler.sizes);
		this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.#renderer.shadowMap.enabled = true;
		this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.#renderer.setClearColor(0x000000, 0);
	}
}
