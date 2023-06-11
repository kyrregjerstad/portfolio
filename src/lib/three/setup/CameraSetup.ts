import type { ResizeHandler } from "./ResizeHandler";
import * as THREE from "three";
import type { Initializable } from "../types";

export class CameraSetup implements Initializable {
	#camera!: THREE.OrthographicCamera;
	#baseZoom: number;
	#resizeHandler: ResizeHandler;

	constructor(resizeHandler: ResizeHandler, baseZoom = 1) {
		this.#resizeHandler = resizeHandler;
		this.#baseZoom = baseZoom;

		this.#setupCamera();

		window.addEventListener("resize", () => this.#updateCamera());
	}

	#setupCamera() {
		const aspectRatio = this.#resizeHandler.sizes.width / this.#resizeHandler.sizes.height;

		this.#camera = new THREE.OrthographicCamera(-aspectRatio * 10, aspectRatio * 10, 10, -10, 0.01, 1000);

		this.#camera.zoom = this.#calculateZoomFactor();
		this.#camera.updateProjectionMatrix();

		this.#camera.position.set(0, 0, 50);
	}

	#calculateZoomFactor() {
		const zoomOffset = 3500;
		return this.#baseZoom * (this.#resizeHandler.sizes.width / zoomOffset);
	}

	#updateCamera() {
		this.#camera.zoom = this.#calculateZoomFactor();
		this.#camera.updateProjectionMatrix();
	}

	setAspectRatio(sizes: { width: number; height: number }) {
		const aspectRatio = sizes.width / sizes.height;
		this.#camera.left = -aspectRatio * 10;
		this.#camera.right = aspectRatio * 10;
		this.#camera.top = 10;
		this.#camera.bottom = -10;
		this.#camera.updateProjectionMatrix();
	}

	get instance() {
		return this.#camera;
	}

	init() {
		this.#camera.position.set(0, 0, 100);
	}
}
