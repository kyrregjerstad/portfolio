import type { ParticleConfig } from './Particle';
import { Particle } from './Particle';

export class ParticleSystem {
	private readonly particles: Particle[];
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly mappedImage: MappedImage = [];
	private animationId: number | null = null;
	private lastTime: number = 0;
	private readonly config: Required<SystemConfig>;
	private readonly frameInterval: number;
	private particleGrid: Set<Particle>[][];
	private mouseX: number = 0;
	private mouseY: number = 0;
	private cursorInteraction: boolean = false;
	private cursorRadius: number = 100;
	private cursorForce: number = 0.5;
	private width: number;
	private height: number;
	private initialPositions: Array<{ x: number; y: number }> = [];
	private colorCache: Map<string, { r: number; g: number; b: number }> = new Map();
	private currentBlendedColors: Map<string, string> = new Map();
	private lastOverlayColor: string = '';
	private lastOverlayIntensity: number = 0;
	private colorParseCtx: CanvasRenderingContext2D | null = null;
	constructor(canvas: HTMLCanvasElement, config: SystemConfig = {}) {
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) throw new Error('Could not get canvas context');
		this.ctx = ctx;

		// Set defaults for system config
		this.config = {
			numberOfParticles: config.numberOfParticles ?? 20000,
			gridSize: config.gridSize ?? 100,
			targetFPS: config.targetFPS ?? 60,
			trailIntensity: config.trailIntensity ?? 0.5,
			particleOpacityDivisor: config.particleOpacityDivisor ?? 1.5,
			backgroundColor: config.backgroundColor ?? 'rgb(0, 0, 0)',
			speedMultiplier: config.speedMultiplier ?? 1,
			timeStep: config.timeStep ?? 1,
			particleConfig: {
				minSize: config.particleConfig?.minSize ?? 0.5,
				maxSize: config.particleConfig?.maxSize ?? 1.5,
				shape: config.particleConfig?.shape ?? 'circle',
				minVelocity: config.particleConfig?.minVelocity ?? 0,
				maxVelocity: config.particleConfig?.maxVelocity ?? 0.5,
				minSpeed: config.particleConfig?.minSpeed ?? 1,
				baseMovementSpeed: config.particleConfig?.baseMovementSpeed ?? 2.5,
				color: config.particleConfig?.color ?? 'white',
				movementPattern: config.particleConfig?.movementPattern ?? 'rain',
				angle: config.particleConfig?.angle ?? 0,
				waveAmplitude: config.particleConfig?.waveAmplitude ?? 1,
				waveFrequency: config.particleConfig?.waveFrequency ?? 0.02,
				turbulence: config.particleConfig?.turbulence ?? 0
			},
			cursorInteraction: config.cursorInteraction ?? false,
			cursorRadius: config.cursorRadius ?? 100,
			cursorForce: config.cursorForce ?? 0.5,
			staticMode: config.staticMode ?? false,
			colorOverlay: {
				enabled: config.colorOverlay?.enabled ?? false,
				color: config.colorOverlay?.color ?? '#ffffff',
				intensity: config.colorOverlay?.intensity ?? 0.5
			}
		};
		this.frameInterval = 1000 / this.config.targetFPS;

		// Create particles
		this.particles = Array.from(
			{ length: this.config.numberOfParticles },
			() => new Particle(canvas.width, canvas.height, this.config.particleConfig)
		);

		// Initialize spatial partitioning grid
		this.particleGrid = Array.from(
			{ length: Math.ceil(canvas.height / this.config.gridSize) },
			() => Array.from({ length: Math.ceil(canvas.width / this.config.gridSize) }, () => new Set())
		);

		this.ctx.imageSmoothingEnabled = false;

		// Initialize cursor interaction properties from config
		this.cursorInteraction = config.cursorInteraction ?? false;
		this.cursorRadius = config.cursorRadius ?? 100;
		this.cursorForce = config.cursorForce ?? 0.5;

		// Store initial positions when particles are created
		this.initialPositions = this.particles.map((p) => ({
			x: p.x,
			y: p.y
		}));
	}

	public initialize(imageData: ImageData): void {
		const { width, height, data } = imageData;

		// Pre-calculate brightness values
		for (let y = 0; y < height; y++) {
			const row: MappedImage[number] = [];
			const rowOffset = y * width * 4;

			for (let x = 0; x < width; x++) {
				const index = rowOffset + x * 4;
				const red = data[index];
				const green = data[index + 1];
				const blue = data[index + 2];
				const brightness = this.calculateRelativeBrightness(red, green, blue);
				row.push({
					brightness,
					color: `rgb(${red}, ${green}, ${blue})`,
					position: [x, y]
				});
			}
			this.mappedImage.push(row);
		}
	}

	private calculateRelativeBrightness(r: number, g: number, b: number): number {
		// Using bit shifting for faster integer math
		return Math.sqrt((r * r * 299 + g * g * 587 + b * b * 114) >> 10) / 100;
	}

	private updateParticleGrid(): void {
		// Clear all grid cells
		for (const row of this.particleGrid) {
			for (const cell of row) {
				cell.clear();
			}
		}

		// Assign particles to grid cells
		for (const particle of this.particles) {
			const gridX = Math.floor(particle.x / this.config.gridSize);
			const gridY = Math.floor(particle.y / this.config.gridSize);

			if (
				gridY >= 0 &&
				gridY < this.particleGrid.length &&
				gridX >= 0 &&
				gridX < this.particleGrid[0].length
			) {
				this.particleGrid[gridY][gridX].add(particle);
			}
		}
	}

	public start(): void {
		if (this.animationId !== null) return;
		this.lastTime = performance.now();
		this.animate(this.lastTime);
	}

	public stop(): void {
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	private animate = (currentTime: number): void => {
		this.animationId = requestAnimationFrame(this.animate);

		const elapsed = currentTime - this.lastTime;
		if (elapsed < this.frameInterval) return;

		this.lastTime = currentTime - (elapsed % this.frameInterval);
		this.updateParticleGrid();

		// Trail effect
		this.ctx.globalAlpha = this.config.trailIntensity;
		this.ctx.fillStyle = this.config.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw particles
		const colorOpacityGroups: Map<string, Map<number, Particle[]>> = new Map();

		const effectiveTimeStep = this.config.timeStep * this.config.speedMultiplier;

		for (const particle of this.particles) {
			const gridY = Math.floor(particle.y);
			const gridX = Math.floor(particle.x);

			if (
				gridY >= 0 &&
				gridY < this.mappedImage.length &&
				gridX >= 0 &&
				gridX < this.mappedImage[0].length
			) {
				const pixelData = this.mappedImage[gridY][gridX];
				particle.color = pixelData.color;

				// Only update particle position if not in static mode or if cursor interaction is active
				if (
					!this.config.staticMode ||
					(this.cursorInteraction && this.isParticleNearCursor(particle))
				) {
					particle.update(
						pixelData.brightness,
						effectiveTimeStep,
						this.cursorInteraction
							? {
									x: this.mouseX,
									y: this.mouseY,
									radius: this.cursorRadius,
									force: this.cursorForce,
									isStatic: this.config.staticMode
								}
							: undefined
					);
				}
			}

			const opacity = Math.round((particle.speed / this.config.particleOpacityDivisor) * 100) / 100;

			// Group particles by color first, then by opacity
			if (!colorOpacityGroups.has(particle.color)) {
				colorOpacityGroups.set(particle.color, new Map());
			}
			const opacityGroups = colorOpacityGroups.get(particle.color)!;

			if (!opacityGroups.has(opacity)) {
				opacityGroups.set(opacity, []);
			}
			opacityGroups.get(opacity)!.push(particle);
		}

		// Draw particles grouped by color and opacity
		for (const [color, opacityGroups] of colorOpacityGroups) {
			for (const [opacity, particles] of opacityGroups) {
				this.ctx.fillStyle = color;
				this.ctx.globalAlpha = opacity;

				for (const particle of particles) {
					this.drawParticle(particle, this.ctx);
				}
			}
		}

		// Update color cache if needed
		this.updateBlendedColorsCache();
	};

	updateMousePosition(x: number, y: number) {
		this.mouseX = x;
		this.mouseY = y;
	}

	public updateDimensions(width: number, height: number) {
		this.width = width;
		this.height = height;

		// Update canvas dimensions
		this.canvas.width = width;
		this.canvas.height = height;

		// Reinitialize particle grid for new dimensions
		this.particleGrid = Array.from({ length: Math.ceil(height / this.config.gridSize) }, () =>
			Array.from({ length: Math.ceil(width / this.config.gridSize) }, () => new Set())
		);

		// Update particles with new boundaries
		for (const particle of this.particles) {
			if (particle.x > width) particle.x = width;
			if (particle.y > height) particle.y = height;
		}
	}

	// Add method to toggle static mode
	public toggleStaticMode(enabled: boolean): void {
		this.config.staticMode = enabled;
		if (enabled) {
			// Reset particles to their initial positions when enabling static mode
			this.particles.forEach((particle, index) => {
				particle.x = this.initialPositions[index].x;
				particle.y = this.initialPositions[index].y;
			});
		}
	}

	// Helper method to check if particle is near cursor
	private isParticleNearCursor(particle: Particle): boolean {
		const dx = particle.x - this.mouseX;
		const dy = particle.y - this.mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < this.cursorRadius;
	}

	// Add method to reset particles to initial positions
	public resetParticles(): void {
		this.particles.forEach((particle, index) => {
			particle.x = this.initialPositions[index].x;
			particle.y = this.initialPositions[index].y;
			particle.vx = 0;
			particle.vy = 0;
		});
	}

	public updateSettings(newSettings: Partial<SystemConfig>): void {
		// Update config values that don't require reinitialization
		if (newSettings.trailIntensity !== undefined) {
			this.config.trailIntensity = newSettings.trailIntensity;
		}
		if (newSettings.speedMultiplier !== undefined) {
			this.config.speedMultiplier = newSettings.speedMultiplier;
		}
		if (newSettings.cursorInteraction !== undefined) {
			this.cursorInteraction = newSettings.cursorInteraction;
		}
		if (newSettings.cursorRadius !== undefined) {
			this.cursorRadius = newSettings.cursorRadius;
		}
		if (newSettings.cursorForce !== undefined) {
			this.cursorForce = newSettings.cursorForce;
		}

		if (newSettings.particleConfig) {
			// Update particle config properties that don't require reinitialization
			if (newSettings.particleConfig.color !== undefined) {
				this.config.particleConfig.color = newSettings.particleConfig.color;
			}
			if (newSettings.particleConfig.turbulence !== undefined) {
				this.config.particleConfig.turbulence = newSettings.particleConfig.turbulence;
			}
			if (newSettings.particleConfig.minSize !== undefined) {
				this.config.particleConfig.minSize = newSettings.particleConfig.minSize;
			}
			if (newSettings.particleConfig.maxSize !== undefined) {
				this.config.particleConfig.maxSize = newSettings.particleConfig.maxSize;
			}
			if (newSettings.particleConfig.shape !== undefined) {
				this.config.particleConfig.shape = newSettings.particleConfig.shape;
			}
		}
		if (newSettings.staticMode !== undefined) {
			this.config.staticMode = newSettings.staticMode;
			if (newSettings.staticMode) {
				// Reset particles to their initial positions when enabling static mode
				this.resetParticles();
			}
		}
		if (newSettings.colorOverlay) {
			const oldEnabled = this.config.colorOverlay.enabled;
			const newEnabled = newSettings.colorOverlay.enabled;

			this.config.colorOverlay = {
				...this.config.colorOverlay,
				...newSettings.colorOverlay
			};

			// Clear caches if overlay settings changed
			if (
				oldEnabled !== newEnabled ||
				newSettings.colorOverlay.color !== undefined ||
				newSettings.colorOverlay.intensity !== undefined
			) {
				this.currentBlendedColors.clear();
			}
		}
	}

	private drawParticle(particle: Particle, ctx: CanvasRenderingContext2D): void {
		const halfSize = particle.size / 2;
		const size = particle.size;

		if (this.config.colorOverlay.enabled) {
			const cacheKey = particle.color;
			let blendedColorStr = this.currentBlendedColors.get(cacheKey);

			if (!blendedColorStr) {
				const baseColor = this.parseColor(particle.color);
				const overlayColor = this.parseColor(this.config.colorOverlay.color);
				const intensity = this.config.colorOverlay.intensity;

				const blended = this.blendColors(baseColor, overlayColor, intensity);
				blendedColorStr = `rgb(${blended.r}, ${blended.g}, ${blended.b})`;
				this.currentBlendedColors.set(cacheKey, blendedColorStr);
			}

			ctx.fillStyle = blendedColorStr;
		} else {
			ctx.fillStyle = particle.color;
		}

		switch (this.config.particleConfig.shape) {
			case 'square':
				ctx.fillRect(particle.x - halfSize, particle.y - halfSize, particle.size, particle.size);
				break;

			case 'triangle':
				ctx.beginPath();
				ctx.moveTo(particle.x, particle.y - size);
				ctx.lineTo(particle.x + size, particle.y + size);
				ctx.lineTo(particle.x - size, particle.y + size);
				ctx.closePath();
				ctx.fill();
				break;

			case 'circle':
			default:
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fill();
				break;
		}
	}

	private parseColor(color: string): { r: number; g: number; b: number } {
		if (this.colorCache.has(color)) {
			return this.colorCache.get(color)!;
		}

		// Only create canvas context once for parsing
		if (!this.colorParseCtx) {
			const canvas = document.createElement('canvas');
			this.colorParseCtx = canvas.getContext('2d')!;
		}

		this.colorParseCtx.fillStyle = color;
		const parsed = {
			r: parseInt(this.colorParseCtx.fillStyle.slice(1, 3), 16),
			g: parseInt(this.colorParseCtx.fillStyle.slice(3, 5), 16),
			b: parseInt(this.colorParseCtx.fillStyle.slice(5, 7), 16)
		};

		this.colorCache.set(color, parsed);
		return parsed;
	}

	private blendColors(
		base: { r: number; g: number; b: number },
		overlay: { r: number; g: number; b: number },
		intensity: number
	): { r: number; g: number; b: number } {
		return {
			r: Math.round(base.r * (1 - intensity) + overlay.r * intensity),
			g: Math.round(base.g * (1 - intensity) + overlay.g * intensity),
			b: Math.round(base.b * (1 - intensity) + overlay.b * intensity)
		};
	}

	private updateBlendedColorsCache(): void {
		if (
			!this.config.colorOverlay.enabled ||
			(this.lastOverlayColor === this.config.colorOverlay.color &&
				this.lastOverlayIntensity === this.config.colorOverlay.intensity)
		) {
			return;
		}

		this.currentBlendedColors.clear();
		const intensity = this.config.colorOverlay.intensity;

		this.lastOverlayColor = this.config.colorOverlay.color;
		this.lastOverlayIntensity = intensity;
	}
}

export type MappedImage = Array<
	Array<{
		brightness: number;
		color: string;
		position: [number, number];
	}>
>;

export interface SystemConfig {
	numberOfParticles?: number;
	gridSize?: number;
	targetFPS?: number;
	trailIntensity?: number; // 0-1, controls the alpha of trail effect
	particleOpacityDivisor?: number; // Higher number = more transparent particles
	backgroundColor?: string;
	particleConfig?: ParticleConfig;
	speedMultiplier?: number; // Global speed control (0-1)
	timeStep?: number; // How much time advances each frame (0-1)
	cursorInteraction?: boolean;
	cursorRadius?: number;
	cursorForce?: number;
	staticMode?: boolean;
	colorOverlay?: {
		enabled: boolean;
		color: string;
		intensity: number;
	};
}
