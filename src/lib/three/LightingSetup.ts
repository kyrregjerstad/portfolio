import * as THREE from "three";

export class LightingSetup {
	scene: THREE.Scene;

	constructor(scene: THREE.Scene) {
		this.scene = scene;
	}

	configureAmbientLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		this.scene.add(ambientLight);
	}
}
