import * as THREE from "three";

interface CubeCreatorConfig {
	weekIndex: number;
	dayIndex: number;
	contributionCount: number;
	maxContributions: number;
	contributionCap: number;
	maxHeight: number;
	minHeight: number;
}

export class CubeCreator {
	createCube(config: CubeCreatorConfig): THREE.Mesh {
		let contributionCount = config.contributionCount;
		if (contributionCount > config.contributionCap) {
			contributionCount = config.contributionCap;
		}

		const scaledContributionCount =
			((contributionCount / config.contributionCap) * (config.maxHeight - config.minHeight) + config.minHeight) * 4;

		const geometry = new THREE.BoxGeometry(1, scaledContributionCount, 1);

		const cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial().clone());

		cube.userData.scaledContributionCount = scaledContributionCount;

		const lightness = (config.contributionCount / config.maxContributions) * 0.6 + 0.03;

		cube.material.color.setHSL(0.3, 1, lightness);

		cube.castShadow = true;
		cube.receiveShadow = true;

		return cube;
	}
}
