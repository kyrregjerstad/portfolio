import type { ResizeHandler } from "./ResizeHandler";
import * as THREE from "three";

export class Renderer {
	#renderer: THREE.WebGLRenderer;

	constructor(resizeHandler: ResizeHandler, canvas: HTMLCanvasElement) {
		this.#renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});

		this.setSize(resizeHandler.sizes);
		this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.#renderer.shadowMap.enabled = true;
		this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.#renderer.setClearColor(0x000000, 0);
	}

	setSize(sizes: { width: number; height: number }) {
		this.#renderer.setSize(sizes.width, sizes.height);
	}

	get instance() {
		return this.#renderer;
	}
}
