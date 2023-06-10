import type { ContributionData } from "./ContributionData";
import * as THREE from "three";

export class ContributionVisualizer {
	private contributionData: ContributionData;
	private cubeGroup: THREE.Group;
	private material: THREE.MeshStandardMaterial;

	constructor(contributionData: ContributionData) {
		this.contributionData = contributionData;
		this.cubeGroup = new THREE.Group();
		this.material = new THREE.MeshStandardMaterial();
	}

	private createCube(day: ContributionDay, dayIndex: number, weekIndex: number): THREE.Mesh {
		const contributionCap = 40;
		let contributionCount = day.contributionCount > contributionCap ? contributionCap : day.contributionCount;
		const scaledContributionCount = ((contributionCount / contributionCap) * (maxHeight - minHeight) + minHeight) * 4;
		const geometry = new THREE.BoxGeometry(1, scaledContributionCount, 1);
		const cube = new THREE.Mesh(geometry, this.material.clone());

		cube.userData.scaledContributionCount = scaledContributionCount;
		const lightness = (day.contributionCount / this.contributionData.getMaxContributions()) * 0.6 + 0.03;
		cube.material.color.setHSL(0.3, 1, lightness);
		cube.castShadow = true;
		cube.receiveShadow = true;
		const gapSize = 2;
		cube.position.set(dayIndex * gapSize, scaledContributionCount / 2, weekIndex * gapSize);
		cube.scale.y = initialHeight;

		return cube;
	}

	private createCubes(): void {
		const weeks = this.contributionData.getWeeks();
		weeks.forEach((week, weekIndex) => {
			week.contributionDays.forEach((day, dayIndex) => {
				const cube = this.createCube(day, dayIndex, weekIndex);
				this.cubeGroup.add(cube);
			});
		});
	}

	public addToScene(scene: THREE.Scene): void {
		this.createCubes();
		this.cubeGroup.position.set(80, -10, 0);
		this.cubeGroup.rotation.z = Math.PI / 2;
		this.cubeGroup.rotation.y = -Math.PI / 2;
		const wrapper = new THREE.Group();
		wrapper.add(this.cubeGroup);
		scene.add(wrapper);
	}
}
