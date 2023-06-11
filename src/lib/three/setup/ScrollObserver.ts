interface ScrollObserverConfig {
	target: HTMLElement;
	callback: () => void;
	rootMargin?: string;
}

export class ScrollObserver {
	#target: HTMLElement;
	#callback: () => void;
	#intersectionObserver: IntersectionObserver;

	constructor(config: ScrollObserverConfig) {
		this.#target = config.target;
		this.#callback = config.callback;

		this.#intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.#callback();
						this.#intersectionObserver.disconnect();
					}
				});
			},
			{
				threshold: 1,
				rootMargin: config.rootMargin || "0px"
			}
		);
	}

	observe() {
		this.#intersectionObserver.observe(this.#target);
	}
}
