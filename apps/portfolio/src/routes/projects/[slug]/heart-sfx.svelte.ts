export class HeartSFX {
	private count = $state(0);
	private maxCount = 12;
	private maxCountReached = $derived(this.count >= this.maxCount);

	increment() {
		if (!this.maxCountReached) {
			this.count++;
			this.playSfx();
		}
	}

	getCount() {
		return this.count;
	}

	getMaxCountReached() {
		return this.maxCountReached;
	}

	private playSfx() {
		const audio = new Audio(`/audio/sfx/heart_${this.count}.mp3`);
		audio.volume = 0.25;
		audio.play();
	}
}
