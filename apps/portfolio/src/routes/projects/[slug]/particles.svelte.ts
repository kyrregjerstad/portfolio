import { Spring } from 'svelte/motion';

type Options = {
	count: number;
};

class Particle {
	private static nextId = 0;
	id: number;
	position = $state({ x: 0, y: 0 });
	velocity = $state({ x: 0, y: 0 });
	opacity = $state(1);
	scale = $state(0.5 + Math.random() * 0.5);

	constructor(x: number, y: number) {
		this.id = Particle.nextId++;
		this.position = { x, y };
		this.velocity = {
			x: (Math.random() - 0.5) * 4,
			y: -Math.random() * 4 - 3,
		};
		this.opacity = 1;
		this.scale = 0.5 + Math.random() * 0.5;
	}
}

export class Particles {
	private target: HTMLElement;
	private particles: Particle[] = $state([]);
	private count = $state(8);
	private animationFrame: number | null = null;

	constructor(target: HTMLElement, options: Options = { count: 8 }) {
		this.target = target;
		this.count = options.count;
	}

	private updateParticles() {
		this.particles = this.particles
			.map((p) => {
				p.position.x += p.velocity.x;
				p.position.y += p.velocity.y;
				p.velocity.y += 0.15;
				p.opacity -= 0.015;
				return p;
			})
			.filter((p) => p.opacity > 0);

		if (this.particles.length > 0) {
			this.animationFrame = requestAnimationFrame(() => this.updateParticles());
		} else {
			this.animationFrame = null;
		}
	}

	private spawnParticles(x: number, y: number) {
		this.particles.push(...Array.from({ length: this.count }, () => new Particle(x, y)));
		if (!this.animationFrame) {
			this.updateParticles();
		}
	}

	trigger() {
		const rect = this.target.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		this.spawnParticles(centerX, centerY);
	}

	getParticles() {
		return this.particles;
	}
}
