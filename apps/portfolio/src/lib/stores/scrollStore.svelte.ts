class ScrollStore {
	#scrollY = $state(0);
	#scrollX = $state(0);
	scrollDirection = $state<'up' | 'down'>('down');
	lastScrollY = $state(0);

	get scrollY() {
		return this.#scrollY;
	}

	set scrollY(value: number) {
		this.lastScrollY = this.#scrollY;
		this.#scrollY = value;
		this.scrollDirection = this.lastScrollY > this.#scrollY ? 'up' : 'down';
	}

	get scrollX() {
		return this.#scrollX;
	}

	set scrollX(value: number) {
		this.#scrollX = value;
	}
}

export const scrollStore = new ScrollStore();
