type Particle = {
	id: number;
	x: number;
	y: number;
	velocity: { x: number; y: number };
	opacity: number;
	scale: number;
};

export class Particles {
	private particles: Particle[] = $state([]);
	private particleId = $state(0);

	private createParticle(x: number, y: number) {
		return {
			id: this.particleId++,
			x,
			y,
		};
	}

	trigger(event: MouseEvent) {}
}
