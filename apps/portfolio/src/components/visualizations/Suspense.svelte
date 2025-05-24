<script lang="ts">
	import { browser } from '$app/environment';
	import { Application, Container, Graphics, GraphicsContext, Text, TextStyle } from 'pixi.js';
	import { initDevtools } from '@pixi/devtools';
	import gsap from 'gsap';

	let app: Application;
	let container: HTMLDivElement;

	// Flow configuration
	let promiseDuration = $state(2000); // ms
	let shouldReject = $state(false);
	let showLoadingFallback = $state(true);
	let isRunning = $state(false);

	const BOX_PADDING = 20;
	const BOX_RADIUS = 10;
	const ARROW_HEAD_SIZE = 10;
	const BOX_WIDTH = 160;
	const BOX_HEIGHT = 60;

	const POSITIONS = {
		serverComponent: { x: 0.01, y: 0.5 },
		suspense: { x: 0.35, y: 0.5 },
		loadingFallback: { x: 0.35, y: 0.2 },
		clientComponent: { x: 0.8, y: 0.2 },
		errorBoundary: { x: 0.8, y: 0.7 },
	};

	class FlowBox extends Container {
		private box: Graphics;
		private fillBox: Graphics;
		private backgroundBox: Graphics;
		protected _label: Text;
		private _progress = 0;
		private _isFilled = false;
		private _isActive = false;
		private activeColor: number;

		constructor(text: string, activeColor = 0x4caf50) {
			super();

			this.activeColor = activeColor;

			// Background box for flash effect
			this.backgroundBox = new Graphics();
			this.backgroundBox.beginFill(activeColor);
			this.backgroundBox.drawRoundedRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS);
			this.backgroundBox.endFill();
			this.backgroundBox.alpha = 0;

			// Main box outline
			this.box = new Graphics(boxContext);

			// Progress fill box
			this.fillBox = new Graphics();
			this.fillBox.beginFill(activeColor);
			this.fillBox.drawRoundedRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS);
			this.fillBox.endFill();
			this.fillBox.alpha = 0.3;
			this.fillBox.scale.x = 0;

			// Create text
			const style = new TextStyle({
				fontFamily: 'Arial',
				fontSize: 16,
				fill: 0xffffff,
			});
			this._label = new Text(text, style);
			this._label.anchor.set(0.5);
			this._label.position.set(BOX_WIDTH / 2, BOX_HEIGHT / 2);

			this.addChild(this.backgroundBox, this.fillBox, this.box, this._label);
		}

		public flash() {
			return gsap
				.timeline()
				.to(this.backgroundBox, {
					alpha: 0.3,
					duration: 0.2,
					ease: 'power2.in',
				})
				.to(this.backgroundBox, {
					alpha: 0,
					duration: 0.3,
					ease: 'power2.out',
				});
		}

		public setBackgroundFill(fill: boolean) {
			gsap.to(this.backgroundBox, {
				alpha: fill ? 0.15 : 0,
				duration: 0.3,
				ease: 'power2.inOut',
			});
		}

		// Public method to get the fill scale object for animation
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
				this.fillBox.alpha = 0.6;
			}
		}

		public reset() {
			this._progress = 0;
			this._isFilled = false;
			this._isActive = false;
			this.fillBox.scale.x = 0;
			this.fillBox.alpha = 0.3;
			this.backgroundBox.alpha = 0;
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

			// Draw the path with 90-degree turns
			arrowContext.moveTo(fromX, fromY);

			if (withVerticalFirst) {
				// Go vertical first, then horizontal
				arrowContext.lineTo(fromX, toY);
				arrowContext.lineTo(toX - turnOffset, toY); // Stop before the final node
				arrowContext.lineTo(toX, toY); // Connect to the final node
			} else {
				// Go horizontal first, then vertical
				const midX = toX - turnOffset; // Calculate where to make the turn
				arrowContext.lineTo(midX, fromY);
				arrowContext.lineTo(midX, toY);
				arrowContext.lineTo(toX, toY);
			}

			// Draw the line
			arrowContext.stroke({ color: 0xffffff, width: 2 });

			// Calculate angle for arrow head (always horizontal since we're using orthogonal paths)
			const angle = 0; // Arrow always points right

			// Draw arrow head
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
				.fill(0xffffff);

			this.arrow = new Graphics(arrowContext);
			this.addChild(this.arrow);
		}
	}

	class FlowParticle extends Container {
		private static successContext = new GraphicsContext().circle(0, 0, 20).fill(0x4caf50);
		private static errorContext = new GraphicsContext().circle(0, 0, 20).fill(0xff5252);

		private particle: Graphics;

		constructor(isError = false) {
			super();
			this.particle = new Graphics(isError ? FlowParticle.errorContext : FlowParticle.successContext);
			this.particle.alpha = 0.8;
			this.addChild(this.particle);
		}

		public setAlpha(alpha: number) {
			this.particle.alpha = alpha;
		}
	}

	// Create shared GraphicsContext for boxes
	const boxContext = new GraphicsContext()
		.roundRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS)
		.stroke({ width: 2, color: 0xffffff })
		.fill({ color: 0x000000, alpha: 0 });

	let boxes: { [key: string]: FlowBox } = {};
	let animationCleanup: (() => void) | null = null;

	function startAnimation() {
		if (isRunning) return;
		isRunning = true;

		// Reset all boxes
		Object.values(boxes).forEach((box) => box.reset());

		// Create a master timeline
		const master = gsap.timeline({
			onComplete: () => {
				isRunning = false;
			},
		});

		// Create particle timeline for first phase
		const particle1Tl = gsap.timeline();

		// Setup first particle (server to suspense)
		const particle1 = new FlowParticle(false);
		const startX = boxes.serverComponent.x + BOX_WIDTH;
		const startY = boxes.serverComponent.y + BOX_HEIGHT / 2;
		const suspenseX = boxes.suspense.x;
		const suspenseY = boxes.suspense.y + BOX_HEIGHT / 2;

		particle1.position.set(startX, startY);
		particle1.alpha = 0; // Start invisible
		app.stage.addChild(particle1);

		// First phase: Server Component flash and particle movement
		master
			.addLabel('start')
			.add(boxes.serverComponent.flash())
			.addLabel('flashComplete')
			.to(
				particle1,
				{
					alpha: 1,
					duration: 0.2,
					ease: 'power1.inOut',
				},
				'flashComplete'
			)
			.to(
				particle1.position,
				{
					x: (startX + suspenseX) / 2,
					y: startY,
					duration: 0.25,
					ease: 'power1.inOut',
				},
				'>'
			)
			.to(
				particle1.position,
				{
					x: suspenseX,
					y: suspenseY,
					duration: 0.25,
					ease: 'power1.inOut',
				},
				'>'
			)
			.to(particle1, {
				alpha: 0,
				duration: 0.1,
				ease: 'none',
				onComplete: () => {
					app.stage.removeChild(particle1);
				},
			})
			.addLabel('suspenseStart');

		// Animate Suspense and Loading Fallback boxes
		master.to(
			boxes.suspense.getFillScale(),
			{
				x: 1,
				duration: promiseDuration / 1000,
				ease: 'none',
			},
			'suspenseStart'
		);

		// Animate Loading Fallback box if enabled
		if (showLoadingFallback) {
			master.to(
				boxes.loadingFallback.getFillScale(),
				{
					x: 1,
					duration: promiseDuration / 1000,
					ease: 'none',
				},
				'suspenseStart'
			);
		}

		// Setup second particle (suspense to final)
		const particle2 = new FlowParticle(shouldReject);
		const suspenseEndX = boxes.suspense.x + BOX_WIDTH;
		const suspenseEndY = boxes.suspense.y + BOX_HEIGHT / 2;
		const endX = shouldReject ? boxes.errorBoundary.x : boxes.clientComponent.x;
		const endY = shouldReject ? boxes.errorBoundary.y + BOX_HEIGHT / 2 : boxes.clientComponent.y + BOX_HEIGHT / 2;

		particle2.position.set(suspenseEndX, suspenseEndY);
		particle2.alpha = 0;
		app.stage.addChild(particle2);

		// Final phase: Move particle2 to destination
		master
			.addLabel('finalPhase', `suspenseStart+=${promiseDuration / 1000}`)
			.set(particle2, { alpha: 1 }, 'finalPhase')
			.to(
				particle2.position,
				{
					x: endX - 80,
					y: suspenseEndY,
					duration: 0.25,
					ease: 'power1.inOut',
				},
				'finalPhase'
			)
			.to(
				particle2.position,
				{
					x: endX - 80,
					y: endY,
					duration: 0.25,
					ease: 'power1.inOut',
				},
				'>'
			)
			.to(
				particle2.position,
				{
					x: endX,
					y: endY,
					duration: 0.25,
					ease: 'power1.inOut',
				},
				'>'
			)
			.to(
				particle2,
				{
					alpha: 0,
					duration: 0.1,
					ease: 'none',
					onComplete: () => {
						app.stage.removeChild(particle2);
						// Activate final component and fill background
						if (shouldReject) {
							boxes.errorBoundary.setActive(true);
							boxes.errorBoundary.setBackgroundFill(true);
						} else {
							boxes.clientComponent.setActive(true);
							boxes.clientComponent.setBackgroundFill(true);
						}
					},
				},
				'>'
			);
	}

	async function initPixi() {
		if (animationCleanup) {
			animationCleanup();
			animationCleanup = null;
		}

		app = new Application();
		await app.init({
			background: '#10100E',
			resizeTo: container,
			antialias: true,
			hello: true,
		});
		initDevtools(app);
		container.appendChild(app.canvas);

		// Create boxes with different active colors
		boxes = {
			serverComponent: new FlowBox('Server Component', 0x2196f3),
			suspense: new FlowBox('Suspense', 0x2196f3),
			loadingFallback: new FlowBox('LoadingFallback', 0x2196f3),
			clientComponent: new FlowBox('ClientComponent', 0x2196f3),
			errorBoundary: new FlowBox('ErrorBoundary', 0xff5252),
		};

		// Position boxes using relative positions
		boxes.serverComponent.position.set(
			POSITIONS.serverComponent.x * app.screen.width,
			POSITIONS.serverComponent.y * app.screen.height - BOX_HEIGHT / 2
		);
		boxes.suspense.position.set(
			POSITIONS.suspense.x * app.screen.width,
			POSITIONS.suspense.y * app.screen.height - BOX_HEIGHT / 2
		);
		boxes.loadingFallback.position.set(
			POSITIONS.loadingFallback.x * app.screen.width,
			POSITIONS.loadingFallback.y * app.screen.height
		);
		boxes.clientComponent.position.set(
			POSITIONS.clientComponent.x * app.screen.width,
			POSITIONS.clientComponent.y * app.screen.height
		);
		boxes.errorBoundary.position.set(
			POSITIONS.errorBoundary.x * app.screen.width,
			POSITIONS.errorBoundary.y * app.screen.height
		);

		// Create arrows with orthogonal paths
		const arrows = [
			// Server Component to Suspense
			new FlowArrow(
				boxes.serverComponent.x + BOX_WIDTH,
				boxes.serverComponent.y + BOX_HEIGHT / 2,
				boxes.suspense.x,
				boxes.suspense.y + BOX_HEIGHT / 2
			),
			// Suspense to LoadingFallback
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH / 2,
				boxes.suspense.y,
				boxes.loadingFallback.x + BOX_WIDTH / 2,
				boxes.loadingFallback.y + BOX_HEIGHT,
				true // vertical first
			),
			// Branch to ClientComponent
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + BOX_HEIGHT / 2,
				boxes.clientComponent.x,
				boxes.clientComponent.y + BOX_HEIGHT / 2,
				false
			),
			// Branch to ErrorBoundary
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + BOX_HEIGHT / 2,
				boxes.errorBoundary.x,
				boxes.errorBoundary.y + BOX_HEIGHT / 2,
				false
			),
		];

		// Add everything to stage
		app.stage.addChild(...Object.values(boxes), ...arrows);

		// Add resize handler to update positions when the container is resized
		const resizeHandler = () => {
			// Update positions of all elements
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

<div class="mb-4 space-x-4">
	<label>
		Duration: <input
			type="range"
			min="100"
			max="5000"
			step="100"
			bind:value={promiseDuration}
			class="accent-foreground"
		/>
		{promiseDuration}ms
	</label>
	<label>
		<input type="checkbox" bind:checked={shouldReject} /> Should Reject
	</label>
	<label>
		<input type="checkbox" bind:checked={showLoadingFallback} /> Show Loading
	</label>
	<button
		class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
		onclick={() => startAnimation()}
		disabled={isRunning}
	>
		{isRunning ? 'Running...' : 'Start Animation'}
	</button>
</div>
<div bind:this={container} class="h-[400px] w-full"></div>
