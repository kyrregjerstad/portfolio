import * as THREE from "three";
import type { Initializable } from "../types";

export class LightingSetup implements Initializable {
	scene: THREE.Scene;

	constructor(scene: THREE.Scene) {
		this.scene = scene;
	}

	configureAmbientLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		this.scene.add(ambientLight);
	}

	init() {
		this.configureAmbientLight();
	}
}
