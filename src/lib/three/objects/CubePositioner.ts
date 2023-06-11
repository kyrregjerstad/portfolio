import type * as THREE from "three";

interface CubePositionerConfig {
	cube: THREE.Mesh;
	weekIndex: number;
	dayIndex: number;
	gapSize: number;
	initialHeight: number;
}

export class CubePositioner {
	positionCube(config: CubePositionerConfig): THREE.Mesh {
		config.cube.position.x = config.dayIndex * config.gapSize;
		config.cube.position.z = config.weekIndex * config.gapSize;

		config.cube.position.y += config.cube.userData.scaledContributionCount / 2;

		config.cube.scale.y = config.initialHeight;

		return config.cube;
	}
}
