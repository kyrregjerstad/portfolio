import * as THREE from "three";
import { CubeCreator } from "./CubeCreator";
import { CubePositioner } from "./CubePositioner";
import type { ContributionWeek } from "$lib/types/gitHubTypes";

interface CubeGridCreatorConfig {
	maxContributions: number;
	contributionCap: number;
	maxHeight: number;
	minHeight: number;
	initialHeight: number;
	weeks: ContributionWeek[];
}

export class CubeGridCreator {
	cubeCreator: CubeCreator;
	cubePositioner: CubePositioner;

	constructor() {
		this.cubeCreator = new CubeCreator();
		this.cubePositioner = new CubePositioner();
	}

	createGrid(config: CubeGridCreatorConfig): THREE.Group {
		const cubeGroup = new THREE.Group();

		config.weeks.forEach((week, weekIndex) => {
			week.contributionDays.forEach((day, dayIndex) => {
				const cubeCreatorConfig = {
					weekIndex,
					dayIndex,
					contributionCount: day.contributionCount,
					maxContributions: config.maxContributions,
					contributionCap: config.contributionCap,
					maxHeight: config.maxHeight,
					minHeight: config.minHeight
				};

				const cube = this.cubeCreator.createCube(cubeCreatorConfig);

				const cubePositionerConfig = {
					cube,
					weekIndex,
					dayIndex,
					gapSize: 2.25,
					initialHeight: config.initialHeight
				};

				this.cubePositioner.positionCube(cubePositionerConfig);

				cubeGroup.add(cube);
			});
		});

		return cubeGroup;
	}
}
