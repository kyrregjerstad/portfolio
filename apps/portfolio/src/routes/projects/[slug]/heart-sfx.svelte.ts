import { MAX_LIKES_PER_USER } from '@/lib/config';

export class HeartSFX {
	private maxCount = MAX_LIKES_PER_USER;

	increment(likes: number) {
		if (likes < this.maxCount) {
			this.playHeartSFX(likes);
		} else if (likes === this.maxCount) {
			this.playWinnerSFX();
		}
	}

	private playHeartSFX(likes: number) {
		const audio = new Audio(`/audio/sfx/heart_${likes}.mp3`);
		audio.volume = 0.25;
		audio.play();
	}

	private playWinnerSFX() {
		const audio = new Audio(`/audio/sfx/winner.mp3`);
		audio.volume = 0.25;
		audio.play();
	}
}
