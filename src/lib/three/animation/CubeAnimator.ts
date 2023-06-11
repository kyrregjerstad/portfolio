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

	grow(): void {
		const { group, initialHeight } = this.config;

		group.children.forEach((cube, index) => {
			const targetHeight = cube.scale.y;
			const delay = index * 0.0005;
			const duration = index * 0.01;

			cube.scale.y = initialHeight;
			cube.position.y = initialHeight / 2;

			gsap.fromTo(cube.scale, { y: initialHeight }, { y: targetHeight, duration, delay, ease: "power2.out" });
			gsap.fromTo(
				cube.position,
				{ y: initialHeight / 2 },
				{ y: (targetHeight * cube.userData.scaledContributionCount) / 2, duration, delay, ease: "power2.out" }
			);
		});
	}

	rotate(): void {
		const { group } = this.config;

		gsap.to(group.rotation, {
			duration: 2.5,
			x: 0.1,
			y: Math.PI / 2 - 0.75,
			z: Math.PI / 2 - 1.5,
			ease: "power1.out"
		});
		gsap.to(group.position, {
			duration: 2.5,
			x: -50,
			y: -15,
			z: -10,
			ease: "power1.out"
		});
	}
}
