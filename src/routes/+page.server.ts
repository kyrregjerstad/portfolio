import { PUBLIC_GITHUB_URL, PUBLIC_GITHUB_PROFILE } from "$env/static/public";
import { PRIVATE_NOTION_API_TOKEN, PRIVATE_NOTION_DB_ID } from "$env/static/private";
import { Client } from "@notionhq/client";

import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { contactFormSchema } from "$lib/schemas";

export const load = async ({ fetch, parent }) => {
	const fetchGitHubContributions = async () => {
		const response = await fetch("/api/github");
		const data = await response.json();
		return data;
	};
	const notion = new Client({
		auth: PRIVATE_NOTION_API_TOKEN
	});

	async function getDatabasePages() {
		const result = await notion.databases.query({
			database_id: PRIVATE_NOTION_DB_ID
		});

		return result.results;
	}

	return {
		// projects: fetchProjects(),
		gitHubContributions: fetchGitHubContributions(),
		contactForm: superValidate(contactFormSchema, {
			id: "contactForm"
		})
		// notion: getDatabasePages()
	};
};

export const actions = {
	default: async event => {
		const contactForm = await superValidate(event, contactFormSchema);

		if (!contactForm.valid) {
			return fail(400, {
				form: contactForm
			});
		}

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(contactForm.data)
		};

		try {
			const response = await event.fetch("./api/contact", options);
			const data = await response.json();
			return data;
		} catch (error) {
			return {
				status: 500,
				body: {
					message: "There was an error sending the email."
				}
			};
		}
	}
};
