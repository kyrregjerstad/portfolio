import type { GitHubData } from "$lib/types/gitHubTypes";

export class ContributionData {
	private contributionsData: GitHubData;

	constructor(contributionsData: GitHubData) {
		this.contributionsData = contributionsData;
	}

	getMaxContributions(): number {
		let maxContributions = 0;
		const weeks = this.contributionsData.user.contributionsCollection.contributionCalendar.weeks;

		weeks.forEach((week) => {
			week.contributionDays.forEach((day) => {
				if (day.contributionCount > maxContributions) {
					maxContributions = day.contributionCount;
				}
			});
		});

		return maxContributions;
	}

	getTotalContributions(): number {
		const totalContributions =
			this.contributionsData.user.contributionsCollection.contributionCalendar.totalContributions;

		return totalContributions;
	}
}
