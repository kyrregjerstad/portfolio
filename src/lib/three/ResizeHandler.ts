export class ResizeHandler {
	#container: HTMLElement;
	#sizes: { width: number; height: number } = { width: 0, height: 0 };

	constructor(container: HTMLElement) {
		this.#container = container;
		this.#resize();
		window.addEventListener("resize", () => this.#resize());
	}

	#resize() {
		this.#sizes = {
			width: this.#container.offsetWidth,
			height: this.#container.offsetHeight
		};
	}

	get sizes() {
		return this.#sizes;
	}
}
