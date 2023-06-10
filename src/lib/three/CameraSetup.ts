import type { ResizeHandler } from "./ResizeHandler";
import * as THREE from "three";

export class CameraSetup {
	#camera: THREE.OrthographicCamera;
	#zoom: number;

	constructor(resizeHandler: ResizeHandler, zoom = 1) {
		this.#zoom = zoom;
		const aspectRatio = resizeHandler.sizes.width / resizeHandler.sizes.height;

		this.#camera = new THREE.OrthographicCamera(
			-aspectRatio * 10 * this.#zoom,
			aspectRatio * 10 * this.#zoom,
			10 * this.#zoom,
			-10 * this.#zoom,
			0.1,
			100
		);

		this.#camera.position.set(0, 0, 50);
	}

	setAspectRatio(sizes: { width: number; height: number }) {
		const aspectRatio = sizes.width / sizes.height;
		this.#camera.left = -aspectRatio * 10 * this.#zoom;
		this.#camera.right = aspectRatio * 10 * this.#zoom;
		this.#camera.top = 10 * this.#zoom;
		this.#camera.bottom = -10 * this.#zoom;
		this.#camera.updateProjectionMatrix();
	}

	get instance() {
		return this.#camera;
	}
}
