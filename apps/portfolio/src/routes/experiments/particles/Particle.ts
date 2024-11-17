export class Particle {
	public x: number;
	public y: number;
	public vx: number = 0;
	public vy: number = 0;
	public speed: number;
	public readonly size: number;
	public color: string = 'white';
	private readonly velocity: number;
	private readonly canvasWidth: number;
	private readonly canvasHeight: number;
	private readonly config: Required<ParticleConfig>;
	private angle: number;
	private time: number;
	private originalX: number;
	private originalY: number;

	constructor(canvasWidth: number, canvasHeight: number, config: ParticleConfig = {}) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.time = Math.random() * 1000;

		this.config = {
			minSize: config.minSize ?? 0.5,
			maxSize: config.maxSize ?? 1.5,
			minVelocity: config.minVelocity ?? 0,
			maxVelocity: config.maxVelocity ?? 0.5,
			minSpeed: config.minSpeed ?? 1,
			baseMovementSpeed: config.baseMovementSpeed ?? 2.5,
			color: config.color ?? 'white',
			movementPattern: config.movementPattern ?? 'rain',
			angle: config.angle ?? 0,
			waveAmplitude: config.waveAmplitude ?? 1,
			waveFrequency: config.waveFrequency ?? 0.02,
			turbulence: config.turbulence ?? 0,
			shape: config.shape ?? 'circle'
		};

		this.x = Math.random() * canvasWidth;
		this.y = Math.random() * canvasHeight;
		this.speed = 1;
		this.velocity =
			this.config.minVelocity + Math.random() * (this.config.maxVelocity - this.config.minVelocity);
		this.size = this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize);
		this.angle = (this.config.angle * Math.PI) / 180;
		this.originalX = this.x;
		this.originalY = this.y;
	}

	update(
		brightness: number,
		timeStep = 1,
		cursorEffect?: { x: number; y: number; radius: number; force: number; isStatic?: boolean }
	): void {
		this.time += 0.01 * timeStep;
		this.speed = brightness;
		const baseSpeed =
			Math.max(this.config.baseMovementSpeed - this.speed + this.velocity, this.config.minSpeed) *
			timeStep;

		// Reset velocity components
		this.vx = 0;
		this.vy = 0;

		// Calculate movement based on pattern
		const radius = baseSpeed * 2;
		const centerX = this.canvasWidth / 2;
		const centerY = this.canvasHeight / 2;
		const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);

		switch (this.config.movementPattern) {
			case 'rain':
				this.vy = baseSpeed;
				break;

			case 'spiral':
				this.vx = Math.cos(this.time) * radius;
				this.vy = Math.sin(this.time) * radius + baseSpeed * 0.5;
				break;

			case 'drift':
				this.vx = Math.cos(this.angle) * baseSpeed;
				this.vy = Math.sin(this.angle) * baseSpeed;
				break;

			case 'waves':
				this.vx =
					Math.sin(this.y * this.config.waveFrequency + this.time) * this.config.waveAmplitude;
				this.vy = baseSpeed;
				break;

			case 'converge':
				this.vx = Math.cos(angleToCenter) * baseSpeed;
				this.vy = Math.sin(angleToCenter) * baseSpeed;
				break;
		}

		// Add turbulence if configured
		if (this.config.turbulence > 0) {
			this.vx += (Math.random() - 0.5) * this.config.turbulence;
			this.vy += (Math.random() - 0.5) * this.config.turbulence;
		}

		let isUnderCursorInfluence = false;

		// Apply cursor effect if provided
		if (cursorEffect) {
			const dx = this.x - cursorEffect.x;
			const dy = this.y - cursorEffect.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < cursorEffect.radius) {
				isUnderCursorInfluence = true;
				const force = (1 - distance / cursorEffect.radius) * cursorEffect.force;
				this.vx += (dx / distance) * force;
				this.vy += (dy / distance) * force;
			}
		}

		// Only apply return force when not under cursor influence
		if (!isUnderCursorInfluence) {
			// Calculate vector to original position
			const dxToOrigin = this.originalX - this.x;
			const dyToOrigin = this.originalY - this.y;

			// Add a small force towards original position
			this.vx += dxToOrigin * 0.01;
			this.vy += dyToOrigin * 0.01;

			// Add damping to prevent oscillation
			this.vx *= 0.95;
			this.vy *= 0.95;
		}

		// Update position
		this.x += this.vx;
		this.y += this.vy;

		// Wrap around screen edges
		if (this.x < 0) this.x = this.canvasWidth;
		if (this.x > this.canvasWidth) this.x = 0;
		if (this.y < 0) this.y = this.canvasHeight;
		if (this.y > this.canvasHeight) this.y = 0;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		const halfSize = this.size / 2;

		switch (this.config.shape) {
			case 'square':
				ctx.fillRect(this.x - halfSize, this.y - halfSize, this.size, this.size);
				break;

			case 'triangle':
				ctx.beginPath();
				ctx.moveTo(this.x, this.y - this.size);
				ctx.lineTo(this.x + this.size, this.y + this.size);
				ctx.lineTo(this.x - this.size, this.y + this.size);
				ctx.closePath();
				break;

			case 'circle':
			default:
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				break;
		}
	}

	public resetVelocity(): void {
		this.vx = 0;
		this.vy = 0;
	}

	public resetParticle(): void {
		this.x = this.originalX;
		this.y = this.originalY;
		this.vx = 0;
		this.vy = 0;
	}
}

export type MovementPattern = 'rain' | 'spiral' | 'drift' | 'waves' | 'converge';
export type ParticleShape = 'circle' | 'square' | 'triangle';

export interface ParticleConfig {
	minSize?: number;
	maxSize?: number;
	minVelocity?: number;
	maxVelocity?: number;
	minSpeed?: number;
	baseMovementSpeed?: number;
	color?: string;
	movementPattern?: MovementPattern;
	angle?: number; // For directional movement
	waveAmplitude?: number; // For wave patterns
	waveFrequency?: number; // For wave patterns
	turbulence?: number; // Random movement factor
	shape?: ParticleShape; // Particle shape configuration
}
