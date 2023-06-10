export interface ContributionDay {
	date: string;
	contributionCount: number;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
	totalContributions: number;
	weeks: ContributionWeek[];
}

export interface ContributionsCollection {
	contributionCalendar: ContributionCalendar;
}

export interface User {
	contributionsCollection: ContributionsCollection;
}

export interface GitHubData {
	user: User;
}
