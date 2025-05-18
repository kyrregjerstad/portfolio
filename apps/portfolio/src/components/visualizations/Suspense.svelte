<script lang="ts">
	import { browser } from '$app/environment';
	import { Application, Container, Graphics, GraphicsContext, Text, TextStyle } from 'pixi.js';

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

	class FlowBox extends Container {
		private box: Graphics;
		private fillBox: Graphics;
		protected _label: Text;
		private _progress = 0;
		private _isFilled = false;
		private _isActive = false;

		constructor(text: string, activeColor = 0x4caf50) {
			super();

			// Main box outline
			this.box = new Graphics(boxContext);

			// Progress fill box
			this.fillBox = new Graphics();
			this.fillBox.fill({ color: activeColor, alpha: 0.3 });
			this.fillBox.roundRect(0, 0, BOX_WIDTH, BOX_HEIGHT, BOX_RADIUS);
			this.fillBox.fill();
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

			this.addChild(this.fillBox, this.box, this._label);
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
		}

		public get isFilled() {
			return this._isFilled;
		}
	}

	class FlowArrow extends Container {
		private arrow: Graphics;

		constructor(fromX: number, fromY: number, toX: number, toY: number) {
			super();

			const arrowContext = new GraphicsContext();

			// Draw line with pixel-perfect rendering
			arrowContext.moveTo(fromX, fromY).lineTo(toX, toY).stroke({ color: 0xffffff, pixelLine: true });

			// Calculate arrow head
			const angle = Math.atan2(toY - fromY, toX - fromX);

			// Draw arrow head with fill
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
		private static successContext = new GraphicsContext().circle(0, 0, 3).fill(0x4caf50);

		private static errorContext = new GraphicsContext().circle(0, 0, 3).fill(0xff5252);

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

		let startTime = Date.now();
		let hasCompleted = false;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(1, elapsed / promiseDuration);

			// Update progress on boxes
			boxes.suspense.setProgress(progress);
			if (showLoadingFallback) {
				boxes.loadingFallback.setProgress(progress);
			}

			// When animation completes
			if (progress >= 1 && !hasCompleted) {
				hasCompleted = true;

				// Create success/error particle
				const particle = new FlowParticle(shouldReject);
				const startX = boxes.suspense.x + BOX_WIDTH;
				const startY = boxes.suspense.y + (shouldReject ? (BOX_HEIGHT * 3) / 4 : BOX_HEIGHT / 4);
				const endX = shouldReject ? boxes.errorBoundary.x : boxes.clientComponent.x;
				const endY = shouldReject ? boxes.errorBoundary.y + BOX_HEIGHT / 2 : boxes.clientComponent.y + BOX_HEIGHT / 2;

				particle.position.set(startX, startY);
				app.stage.addChild(particle);

				// Animate particle
				let particleProgress = 0;
				const particleDuration = 30; // frames

				const animateParticle = () => {
					particleProgress++;
					particle.position.x = startX + (endX - startX) * (particleProgress / particleDuration);
					particle.position.y = startY + (endY - startY) * (particleProgress / particleDuration);
					particle.setAlpha(Math.sin((particleProgress / particleDuration) * Math.PI));

					if (particleProgress >= particleDuration) {
						app.ticker.remove(animateParticle);
						app.stage.removeChild(particle);
						// Activate final component
						if (shouldReject) {
							boxes.errorBoundary.setActive(true);
						} else {
							boxes.clientComponent.setActive(true);
						}
						isRunning = false;
					}
				};

				app.ticker.add(animateParticle);
				animationCleanup = () => {
					app.ticker.remove(animate);
					app.ticker.remove(animateParticle);
					app.stage.removeChild(particle);
				};
			}
		};

		app.ticker.add(animate);
		animationCleanup = () => app.ticker.remove(animate);
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
		container.appendChild(app.canvas);

		const centerY = app.screen.height / 2;

		// Create boxes with different active colors
		boxes = {
			serverComponent: new FlowBox('Server Component', 0x2196f3),
			suspense: new FlowBox('Suspense', 0x2196f3),
			loadingFallback: new FlowBox('LoadingFallback', 0x2196f3),
			clientComponent: new FlowBox('ClientComponent', 0x2196f3),
			errorBoundary: new FlowBox('ErrorBoundary', 0xff5252),
		};

		// Position boxes
		boxes.serverComponent.position.set(50, centerY - BOX_HEIGHT / 2);
		boxes.suspense.position.set(300, centerY - BOX_HEIGHT / 2);
		boxes.loadingFallback.position.set(300, centerY - BOX_HEIGHT * 2);
		boxes.clientComponent.position.set(550, centerY - BOX_HEIGHT / 2);
		boxes.errorBoundary.position.set(550, centerY + BOX_HEIGHT);

		// Create arrows
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
				boxes.loadingFallback.y + BOX_HEIGHT
			),
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + BOX_HEIGHT / 4,
				boxes.clientComponent.x,
				boxes.clientComponent.y + BOX_HEIGHT / 2
			),
			new FlowArrow(
				boxes.suspense.x + BOX_WIDTH,
				boxes.suspense.y + (BOX_HEIGHT * 3) / 4,
				boxes.errorBoundary.x,
				boxes.errorBoundary.y + BOX_HEIGHT / 2
			),
		];

		// Add everything to stage
		app.stage.addChild(...Object.values(boxes), ...arrows);
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
		Duration: <input type="range" min="500" max="5000" step="100" bind:value={promiseDuration} />
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
