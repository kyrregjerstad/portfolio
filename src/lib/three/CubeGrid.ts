// CubeGrid.ts
import * as THREE from "three";

import { CubeGridCreator } from "$lib/three/CubeGridCreator";
import { ContributionData } from "$lib/three/ContributionData";
import type { GitHubData } from "$lib/types/gitHubTypes";
import type { Initializable } from "./types";

interface CubeGridConfig {
	data: GitHubData;
	maxHeight: number;
	minHeight: number;
	initialHeight: number;
	contributionCap: number;
}

export class CubeGrid implements Initializable {
	config: CubeGridConfig;
	cubeGroup: THREE.Group;

	constructor(config: CubeGridConfig) {
		this.config = config;
		this.cubeGroup = new THREE.Group();
	}

	init() {
		const contributionData = new ContributionData(this.config.data);
		const maxContributions = contributionData.getMaxContributions();
		const weeks = this.config.data.user.contributionsCollection.contributionCalendar.weeks;

		const cubeGridCreator = new CubeGridCreator();
		this.cubeGroup = cubeGridCreator.createGrid({
			maxContributions,
			contributionCap: this.config.contributionCap,
			maxHeight: this.config.maxHeight,
			minHeight: this.config.minHeight,
			initialHeight: this.config.initialHeight,
			weeks
		});

		// Position and rotation
		this.cubeGroup.position.set(-50, -10, 0);
		this.cubeGroup.rotation.z = Math.PI / 2;
		this.cubeGroup.rotation.y = Math.PI / 2;
	}
}
