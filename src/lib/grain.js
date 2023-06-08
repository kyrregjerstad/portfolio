// @ts-nocheck
export function addFilmGrainNoise(backgroundElement) {
	// Create a canvas element and add it to the document
	const canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	backgroundElement.appendChild(canvas);

	// Get the canvas context
	const ctx = canvas.getContext('2d');

	// Generate the noise pattern
	const noise = [];
	for (let i = 0; i < canvas.width; i++) {
		noise[i] = [];
		for (let j = 0; j < canvas.height; j++) {
			noise[i][j] = Math.random() * 255;
		}
	}

	// Draw the noise onto the canvas
	function drawNoise() {
		for (let i = 0; i < canvas.width; i++) {
			for (let j = 0; j < canvas.height; j++) {
				const value = Math.floor(noise[i][j]);
				ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
				ctx.fillRect(i, j, 1, 1);
			}
		}
	}

	// Update the noise pattern and redraw the canvas
	function updateNoise() {
		for (let i = 0; i < canvas.width; i++) {
			for (let j = 0; j < canvas.height; j++) {
				noise[i][j] += (Math.random() * 2 - 1) * 10;
				noise[i][j] = Math.max(0, Math.min(noise[i][j], 255));
			}
		}
		drawNoise();
		requestAnimationFrame(updateNoise);
	}

	// Start the animation
	updateNoise();

	// Apply the noise to the background of the page
	backgroundElement.style.backgroundImage = `url(${canvas.toDataURL()})`;
}
