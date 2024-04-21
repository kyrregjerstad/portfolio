import { superValidate, message } from "sveltekit-superforms/server";
import { fail } from "@sveltejs/kit";
import { contactFormSchema } from "$lib/schemas";
import { getPageData } from "$lib/services/getPageData";

export const load = async (event) => {
	const fetchGitHubContributions = async () => {
		const response = await event.fetch("/api/github");
		const data = await response.json();
		return data;
	};

	return {
		pageData: await getPageData("Home"),
		gitHubContributions: await fetchGitHubContributions(),
		form: await superValidate(event, contactFormSchema)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, contactFormSchema);

		if (!form.valid) {
			return fail(400, {
				form: form
			});
		}

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(form.data)
		};

		try {
			await event.fetch("./api/contact", options);
			return message(form, "Sent!");
		} catch (error) {
			return fail(500, message(form, "Error"));
		}
	}
};
