import { gsap } from "gsap";
import type * as THREE from "three";

interface CubeAnimatorConfig {
	group: THREE.Group;
	initialHeight: number;
}

export class CubeAnimator {
	config: CubeAnimatorConfig;

	constructor(config: CubeAnimatorConfig) {
		this.config = config;
	}

	animate(): void {
		const { group, initialHeight } = this.config;

		group.children.forEach((cube, index) => {
			const targetHeight = cube.scale.y; // Target height is the cube's current height
			const delay = index * 0.005; // Add a small delay between each cube
			const duration = index * 0.01;

			cube.scale.y = initialHeight;
			cube.position.y = initialHeight / 2;

			// Animate the cube's height to the target height using GSAP
			gsap.fromTo(cube.scale, { y: initialHeight }, { y: targetHeight, duration, delay, ease: "power2.out" });
			gsap.fromTo(
				cube.position,
				{ y: initialHeight / 2 },
				{ y: (targetHeight * cube.userData.scaledContributionCount) / 2, duration, delay, ease: "power2.out" }
			);
		});
	}
}
