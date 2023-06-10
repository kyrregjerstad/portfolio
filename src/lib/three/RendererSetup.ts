import * as THREE from "three";

export class RendererSetup {
	container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	createRenderer(): THREE.WebGLRenderer {
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setClearColor(0x000000, 0);
		this.container.appendChild(renderer.domElement);
		return renderer;
	}
}
