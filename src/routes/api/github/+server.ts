import { PRIVATE_GITHUB_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function GET() {
	const token = PRIVATE_GITHUB_TOKEN;
	const endpoint = "https://api.github.com/graphql";

	const headers = {
		Authorization: `bearer ${token}`,
		"Content-Type": "application/json",
		Accept: "application/json"
	};

	// Current date
	const today = new Date();
	const todayString = today.toISOString();

	// Date one year ago
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(today.getFullYear() - 1);
	const oneYearAgoString = oneYearAgo.toISOString();

	const query = `
	{
		user(login: "kyrregjerstad") {
			contributionsCollection(
				from: "${oneYearAgoString}"
				to: "${todayString}"
			) {
				contributionCalendar {
					totalContributions
					weeks {
						contributionDays {
							date
							contributionCount
						}
					}
				}
			}
		}
	}
	  `;

	const response = await fetch(endpoint, {
		method: "POST",
		headers: headers,
		body: JSON.stringify({ query: query })
	});

	if (response.ok) {
		const data = await response.json();
		return json(data);
	} else {
		return { body: { error: response.statusText }, status: response.status };
	}
}
