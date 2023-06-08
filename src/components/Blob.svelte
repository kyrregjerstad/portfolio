<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { spline } from '@georgedoescode/spline';
	import { createNoise2D } from 'simplex-noise';

	onMount(() => {
		// our <path> element
		const path = document.querySelector('path');
		// used to set our custom property values
		const root = document.documentElement;

		let hueNoiseOffset = 0;
		let noiseStep = 0.005;

		const simplex = createNoise2D();

		const points = createPoints();

		(function animate() {
			path.setAttribute('d', spline(points, 1, true));

			// for every point...
			for (let i = 0; i < points.length; i++) {
				const point = points[i];

				// return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
				const nX = noise(point.noiseOffsetX / 20, point.noiseOffsetX / 20);
				const nY = noise(point.noiseOffsetY / 10, point.noiseOffsetY / 15);

				// map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
				const x = map(nX, -1, 1, point.originX - 10, point.originX + 10);
				const y = map(nY, -1, 1, point.originY - 15, point.originY + 50);

				// update the point's current coordinates
				point.x = x;
				point.y = y;

				// progress the point's x, y values through "time"
				point.noiseOffsetX += noiseStep;
				point.noiseOffsetY += noiseStep;
			}

			const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
			const hue = map(hueNoise, -1, 1, 0, 360);

			root.style.setProperty('--startColor', `hsl(${hue}, 100%, 75%)`);
			root.style.setProperty('--stopColor', `hsl(${hue + 60}, 100%, 75%)`);

			hueNoiseOffset += noiseStep / 10;

			requestAnimationFrame(animate);
		})();

		function map(n, start1, end1, start2, end2) {
			return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
		}

		function noise(x, y) {
			// return a value at {x point in time} {y point in time}
			return simplex(x, y);
		}

		function createPoints() {
			const points = [];
			// how many points do we need
			const numPoints = 8;
			// used to equally space each point around the circle
			const angleStep = (Math.PI * 2) / numPoints;
			// the radius of the circle
			const rad = 15;

			for (let i = 1; i <= numPoints; i++) {
				// x & y coordinates of the current point
				const theta = i * angleStep;

				const x = 100 + Math.cos(theta) * rad;
				const y = 100 + Math.sin(theta) * rad;

				// store the point's position
				points.push({
					x: x,
					y: y,
					// we need to keep a reference to the point's original point for when we modulate the values later
					originX: x,
					originY: y,
					// more on this in a moment!
					noiseOffsetX: Math.random() * 1000,
					noiseOffsetY: Math.random() * 1000
				});
			}

			return points;
		}
	});
</script>

<div class="wrapper">
	<svg viewBox="0 0 200 200">
		<defs>
			<linearGradient id="gradient" gradientTransform="rotate(90)">
				<stop id="gradientStop1" offset="0%" stop-color="var(--startColor)" />
				<stop id="gradientStop2 " offset="100%" stop-color="var(--stopColor)" />
			</linearGradient>
		</defs>
		<path d="" fill="url('#gradient')" />
	</svg>
</div>

<style>
	.wrapper {
		filter: blur(50px);
	}
	svg {
		width: 100vmin;
		height: 100vmin;
		filter: blur(20px);

		pointer-events: none;
	}
</style>
