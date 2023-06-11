import type { Initializable } from "../types";

export class ResizeHandler implements Initializable {
	#container: HTMLElement;
	#sizes: { width: number; height: number } = { width: 0, height: 0 };

	constructor(container: HTMLElement) {
		this.#container = container;
		this.#resize();
		window.addEventListener("resize", () => this.#resize());
	}

	#resize() {
		let width = this.#container.offsetWidth;
		let height = this.#container.offsetHeight - 4;

		// enforcing minimum size
		width = Math.max(width, 300);
		height = Math.max(height, 300);

		// enforcing maximum size
		width = Math.min(width, 800);
		height = Math.min(height, 800);

		this.#sizes = {
			width: width,
			height: height
		};
	}

	get sizes() {
		return this.#sizes;
	}

	init() {
		this.#resize();
	}
}
