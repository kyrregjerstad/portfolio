<script lang="ts">
	import { browser } from '$app/environment';
	import { Application, Container, Graphics, GraphicsContext, Text, TextStyle, Filter } from 'pixi.js';
	import { initDevtools } from '@pixi/devtools';
	import Button from '$lib/components/ui/button/button.svelte';
	import gsap from 'gsap';

	let app: Application;
	let container: HTMLDivElement;

	// Flow configuration
	let promiseDuration = $state(1000); // ms
	let shouldReject = $state(false);
	let showLoadingFallback = $state(true);
	let isRunning = $state(false);

	const BOX_PADDING = 24;
	const BOX_RADIUS = 16;
	const ARROW_HEAD_SIZE = 12;
	const BOX_WIDTH = 180;
	const BOX_HEIGHT = 72;

	// Modern color palette
	const COLORS = {
		primary: 0x6366f1, // indigo-500
		primaryLight: 0x818cf8, // indigo-400
		secondary: 0x8b5cf6, // violet-500
		success: 0x10b981, // emerald-500
		successLight: 0x34d399, // emerald-400
		error: 0xef4444, // red-500
		errorLight: 0xf87171, // red-400
		warning: 0xf59e0b, // amber-500
		background: 0x0f172a, // slate-900
		surface: 0x1e293b, // slate-800
		surfaceLight: 0x334155, // slate-700
		text: 0xf8fafc, // slate-50
		textSecondary: 0x94a3b8, // slate-400
		border: 0x475569, // slate-600
		accent: 0x06b6d4, // cyan-500
	};

	const POSITIONS = {
		serverComponent: { x: 0.06, y: 0.5 },
		suspense: { x: 0.4, y: 0.5 },
		loadingFallback: { x: 0.4, y: 0.18 },
		clientComponent: { x: 0.76, y: 0.25 },
		errorBoundary: { x: 0.76, y: 0.75 },
	};

	class FlowBox extends Container {
		private backgroundGradient: Graphics;
		private box: Graphics;
		private fillBox: Graphics;
		private glowBox: Graphics;
		protected _label: Text;
		private _progress = 0;
		private _isFilled = false;
		private _isActive = false;
		private activeColor: number;
		private surfaceColor: number;

		constructor(text: string, activeColor = COLORS.primary, surfaceColor = COLORS.surface) {
			super();

			this.activeColor = activeColor;
			this.surfaceColor = surfaceColor;

			// Glow effect for active state
			this.glowBox = new Graphics();
			this.glowBox.beginFill(activeColor);
			this.glowBox.drawRoundedRect(-4, -4, BOX_WIDTH + 8, BOX_HEIGHT + 8, BOX_RADIUS + 4);
			this.glowBox.endFill();
			this.glowBox.alpha = 0;

			// Background with gradient
			this.backgroundGradient = new Graphics();
			const gradientContext = new GraphicsContext().roundRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS).fill({
				color: surfaceColor,
				alpha: 0.9,
			});
			this.backgroundGradient = new Graphics(gradientContext);

			// Progress fill box with gradient
			this.fillBox = new Graphics();
			this.fillBox.beginFill(activeColor);
			this.fillBox.drawRoundedRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS);
			this.fillBox.endFill();
			this.fillBox.alpha = 0.2;
			this.fillBox.scale.x = 0;

			// Main box outline with enhanced styling
			this.box = new Graphics(this.createBoxContext());

			// Create enhanced text with better typography
			const style = new TextStyle({
				fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
				fontSize: 14,
				fontWeight: '600',
				fill: COLORS.text,
				letterSpacing: 0.5,
				dropShadow: {
					alpha: 0.3,
					angle: Math.PI / 4,
					blur: 4,
					color: 0x000000,
					distance: 2,
				},
			});
			this._label = new Text(text, style);
			this._label.anchor.set(0.5);
			this._label.position.set(BOX_WIDTH / 2, BOX_HEIGHT / 2);

			this.addChild(this.glowBox, this.backgroundGradient, this.fillBox, this.box, this._label);
		}

		private createBoxContext() {
			return new GraphicsContext().roundRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS).stroke({
				width: 2,
				color: COLORS.border,
				alpha: 0.8,
			});
		}

		public flash() {
			return gsap
				.timeline()
				.to(this.glowBox, {
					alpha: 0.4,
					duration: 0.15,
					ease: 'power2.in',
				})
				.to(
					this.fillBox,
					{
						alpha: 0.6,
						duration: 0.15,
						ease: 'power2.in',
					},
					0
				)
				.to(this.glowBox, {
					alpha: 0,
					duration: 0.4,
					ease: 'power2.out',
				})
				.to(
					this.fillBox,
					{
						alpha: 0.2,
						duration: 0.4,
						ease: 'power2.out',
					},
					'-=0.4'
				);
		}

		public setBackgroundFill(fill: boolean) {
			gsap.to(this.glowBox, {
				alpha: fill ? 0.2 : 0,
				duration: 0.5,
				ease: 'power2.inOut',
			});
			gsap.to(this.backgroundGradient, {
				alpha: fill ? 1 : 0.9,
				duration: 0.5,
				ease: 'power2.inOut',
			});
		}

		public getFillScale() {
			return this.fillBox.scale;
		}

		public setProgress(progress: number) {
			this._progress = Math.min(1, Math.max(0, progress));
			this.fillBox.scale.x = this._progress;
			this._isFilled = this._progress >= 1;
		}

		public setActive(active: boolean) {
			this._isActive = active;
			if (active) {
				this.fillBox.alpha = 0.4;
				gsap.to(this.glowBox, {
					alpha: 0.3,
					duration: 0.3,
					ease: 'power2.inOut',
				});
			}
		}

		public reset() {
			this._progress = 0;
			this._isFilled = false;
			this._isActive = false;
			this.fillBox.scale.x = 0;
			this.fillBox.alpha = 0.2;
			this.glowBox.alpha = 0;
			this.backgroundGradient.alpha = 0.9;
		}

		public get isFilled() {
			return this._isFilled;
		}
	}

	class FlowArrow extends Container {
		private arrow: Graphics;

		constructor(fromX: number, fromY: number, toX: number, toY: number, withVerticalFirst = false, turnOffset = 80) {
			super();

			const arrowContext = new GraphicsContext();

			// Enhanced arrow styling with gradient effect
			arrowContext.moveTo(fromX, fromY);

			let finalDirection = { x: 0, y: 0 }; // Track the final segment direction

			// Check if this is a pure vertical arrow (same X coordinates)
			if (Math.abs(fromX - toX) < 5) {
				// Pure vertical arrow
				arrowContext.lineTo(toX, toY);
				finalDirection = { x: 0, y: toY > fromY ? 1 : -1 }; // Down or up
			} else if (withVerticalFirst) {
				arrowContext.lineTo(fromX, toY);
				arrowContext.lineTo(toX - turnOffset, toY);
				arrowContext.lineTo(toX, toY);
				// Final segment is horizontal (left to right)
				finalDirection = { x: 1, y: 0 };
			} else {
				const midX = toX - turnOffset;
				arrowContext.lineTo(midX, fromY);
				arrowContext.lineTo(midX, toY);
				arrowContext.lineTo(toX, toY);
				// Final segment is horizontal (left to right)
				finalDirection = { x: 1, y: 0 };
			}

			// Enhanced line styling
			arrowContext.stroke({
				color: COLORS.border,
				width: 2.5,
				alpha: 0.8,
			});

			// Calculate proper arrow head angle based on final direction
			const angle = Math.atan2(finalDirection.y, finalDirection.x);

			// Enhanced arrow head
			arrowContext
				.moveTo(toX, toY)
				.lineTo(
					toX - ARROW_HEAD_SIZE * Math.cos(angle - Math.PI / 6),
					toY - ARROW_HEAD_SIZE * Math.sin(angle - Math.PI / 6)
				)
				.lineTo(
					toX - ARROW_HEAD_SIZE * Math.cos(angle + Math.PI / 6),
					toY - ARROW_HEAD_SIZE * Math.sin(angle + Math.PI / 6)
				)
				.lineTo(toX, toY)
				.fill({
					color: COLORS.border,
					alpha: 0.8,
				});

			this.arrow = new Graphics(arrowContext);
			this.addChild(this.arrow);
		}
	}

	class FlowParticle extends Container {
		private particle: Graphics;
		private glow: Graphics;

		constructor(isError = false) {
			super();

			const color = isError ? COLORS.error : COLORS.success;
			const lightColor = isError ? COLORS.errorLight : COLORS.successLight;

			// Glow effect
			this.glow = new Graphics();
			this.glow.beginFill(lightColor);
			this.glow.drawCircle(0, 0, 16);
			this.glow.endFill();
			this.glow.alpha = 0.3;

			// Main particle with gradient
			this.particle = new Graphics();
			this.particle.beginFill(color);
			this.particle.drawCircle(0, 0, 8);
			this.particle.endFill();

			// Inner highlight
			const highlight = new Graphics();
			highlight.beginFill(0xffffff);
			highlight.drawCircle(-2, -2, 3);
			highlight.endFill();
			highlight.alpha = 0.6;

			this.addChild(this.glow, this.particle, highlight);

			// Add subtle pulsing animation
			gsap.to(this.glow.scale, {
				x: 1.2,
				y: 1.2,
				duration: 1,
				ease: 'power1.inOut',
				yoyo: true,
				repeat: -1,
			});
		}

		public setAlpha(alpha: number) {
			this.alpha = alpha;
		}
	}

	let boxes: { [key: string]: FlowBox } = {};
	let animationCleanup: (() => void) | null = null;

	function startAnimation() {
		if (isRunning) return;
		isRunning = true;

		// Reset all boxes
		Object.values(boxes).forEach((box) => box.reset());

		// Create a master timeline with enhanced timing
		const master = gsap.timeline({
			onComplete: () => {
				isRunning = false;
			},
		});

		// Enhanced particle animations
		const particle1 = new FlowParticle(false);
		const startX = boxes.serverComponent.x + BOX_WIDTH;
		const startY = boxes.serverComponent.y + BOX_HEIGHT / 2;
		const suspenseX = boxes.suspense.x;
		const suspenseY = boxes.suspense.y + BOX_HEIGHT / 2;

		particle1.position.set(startX, startY);
		particle1.alpha = 0;
		app.stage.addChild(particle1);

		// Enhanced animation sequence
		master
			.addLabel('start')
			.add(boxes.serverComponent.flash())
			.to(
				particle1,
				{
					alpha: 1,
					duration: 0.2,
					ease: 'back.out(1.7)',
				},
				'start+=0.1'
			)
			.to(
				particle1.position,
				{
					x: suspenseX,
					y: suspenseY,
					duration: 0.5,
					ease: 'power2.inOut',
				},
				'start+=0.2'
			)
			.addLabel('suspenseStart', 'start+=0.6')
			.to(
				particle1,
				{
					alpha: 0,
					duration: 0.15,
					ease: 'power2.in',
					onComplete: () => {
						app.stage.removeChild(particle1);
					},
				},
				'suspenseStart-=0.1'
			);

		// Enhanced progress animations
		master.to(
			boxes.suspense.getFillScale(),
			{
				x: 1,
				duration: promiseDuration / 1000,
				ease: 'power1.inOut',
			},
			'suspenseStart'
		);

		if (showLoadingFallback) {
			master.to(
				boxes.loadingFallback.getFillScale(),
				{
					x: 1,
					duration: promiseDuration / 1000,
					ease: 'power1.inOut',
				},
				'suspenseStart'
			);
		}

		// Enhanced final particle
		const particle2 = new FlowParticle(shouldReject);
		const suspenseEndX = boxes.suspense.x + BOX_WIDTH;
		const suspenseEndY = boxes.suspense.y + BOX_HEIGHT / 2;
		const endX = shouldReject ? boxes.errorBoundary.x : boxes.clientComponent.x;
		const endY = shouldReject ? boxes.errorBoundary.y + BOX_HEIGHT / 2 : boxes.clientComponent.y + BOX_HEIGHT / 2;

		particle2.position.set(suspenseEndX, suspenseEndY);
		particle2.alpha = 0;
		app.stage.addChild(particle2);

		master
			.addLabel('finalPhase', `suspenseStart+=${promiseDuration / 1000}`)
			.set(particle2, { alpha: 1 }, 'finalPhase')
			.to(
				particle2.position,
				{
					x: endX - 80,
					y: suspenseEndY,
					duration: 0.5,
					ease: 'power2.inOut',
				},
				'finalPhase'
			)
			.to(
				particle2.position,
				{
					x: endX - 80,
					y: endY,
					duration: 0.5,
					ease: 'power2.inOut',
				},
				'>-=0.05'
			)
			.to(
				particle2.position,
				{
					x: endX,
					y: endY,
					duration: 0.5,
					ease: 'back.out(1.7)',
				},
				'>-=0.05'
			)
			.to(
				particle2,
				{
					alpha: 0,
					duration: 0.15,
					ease: 'power2.in',
				},
				'>-=0.1'
			)
			.call(
				() => {
					// Activate final component immediately as particle starts fading
					app.stage.removeChild(particle2);
					if (shouldReject) {
						boxes.errorBoundary.setActive(true);
						boxes.errorBoundary.setBackgroundFill(true);
					} else {
						boxes.clientComponent.setActive(true);
						boxes.clientComponent.setBackgroundFill(true);
					}
				},
				[],
				'>-=0.15'
			); // Activate during particle fade
	}

	async function initPixi() {
		if (animationCleanup) {
			animationCleanup();
			animationCleanup = null;
		}

		app = new Application();
		await app.init({
			backgroundAlpha: 0,
			resizeTo: container,
			antialias: true,
			hello: true,
		});
		initDevtools(app);
		container.appendChild(app.canvas);

		// Create boxes with enhanced styling
		boxes = {
			serverComponent: new FlowBox('Server Component', COLORS.primary, COLORS.surface),
			suspense: new FlowBox('Suspense', COLORS.secondary, COLORS.surface),
			loadingFallback: new FlowBox('LoadingFallback', COLORS.warning, COLORS.surface),
			clientComponent: new FlowBox('ClientComponent', COLORS.success, COLORS.surface),
			errorBoundary: new FlowBox('ErrorBoundary', COLORS.error, COLORS.surface),
		};

		// Position boxes using relative positions
		Object.entries(boxes).forEach(([key, box]) => {
			const pos = POSITIONS[key as keyof typeof POSITIONS];
			box.position.set(pos.x * app.screen.width, pos.y * app.screen.height - BOX_HEIGHT / 2);
		});

		// Create enhanced arrows
		const arrows = [
			new FlowArrow(
				boxes.serverComponent.x + BOX_WIDTH,
				boxes.serverComponent.y + BOX_HEIGHT / 2,
				boxes.suspense.x,
				boxes.suspense.y + BOX_HEIGHT / 2
			),
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH / 2,
				boxes.suspense.y,
				boxes.loadingFallback.x + BOX_WIDTH / 2,
				boxes.loadingFallback.y + BOX_HEIGHT,
				true
			),
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + BOX_HEIGHT / 2,
				boxes.clientComponent.x,
				boxes.clientComponent.y + BOX_HEIGHT / 2,
				false
			),
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + BOX_HEIGHT / 2,
				boxes.errorBoundary.x,
				boxes.errorBoundary.y + BOX_HEIGHT / 2,
				false
			),
		];

		app.stage.addChild(...Object.values(boxes), ...arrows);

		const resizeHandler = () => {
			Object.entries(boxes).forEach(([key, box]) => {
				const pos = POSITIONS[key as keyof typeof POSITIONS];
				box.position.set(pos.x * app.screen.width, pos.y * app.screen.height - BOX_HEIGHT / 2);
			});

			app.stage.removeChild(...arrows);
			app.stage.addChild(...arrows);
		};

		window.addEventListener('resize', resizeHandler);
		animationCleanup = () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}

	$effect(() => {
		if (browser) {
			initPixi();
		}

		return () => {
			if (app) {
				app.destroy(true);
			}
		};
	});
</script>

<div class="mb-6 rounded-xl border border-slate-700/50 p-6 backdrop-blur-sm">
	<div class="flex items-center justify-between gap-6">
		<div class="flex gap-4">
			<div class="flex items-center gap-3">
				<label for="duration" class="text-sm font-medium text-slate-200">Duration:</label>
				<div class="flex items-center gap-2">
					<input
						type="range"
						id="duration"
						min="100"
						max="2000"
						step="100"
						bind:value={promiseDuration}
						class="accent-foreground slider h-2 w-32 cursor-pointer rounded-lg bg-slate-700"
					/>
					<span class="min-w-[60px] font-mono text-sm text-slate-300">{promiseDuration}ms</span>
				</div>
			</div>

			<!-- Checkboxes -->
			<div class="flex items-center gap-4">
				<label class="flex cursor-pointer items-center gap-2">
					<input type="checkbox" bind:checked={shouldReject} class="h-4 w-4 rounded border-slate-600 bg-slate-700" />
					<span class="text-sm font-medium text-slate-200">Should Reject</span>
				</label>

				<label class="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						bind:checked={showLoadingFallback}
						class="h-4 w-4 rounded border-slate-600 bg-slate-700"
					/>
					<span class="text-sm font-medium text-slate-200">Show Loading</span>
				</label>
			</div>
		</div>

		<Button onclick={() => startAnimation()} disabled={isRunning} variant="outline" class="w-38 ">
			{isRunning ? 'Running...' : 'Start Animation'}
		</Button>
	</div>
</div>

<!-- Enhanced canvas container -->
<div bind:this={container} class="h-[500px] w-full overflow-hidden rounded-xl"></div>
