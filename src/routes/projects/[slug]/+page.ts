import { getProject } from "$lib/services/getProjectQuery.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
	const { slug } = params;
	const project = await getProject(slug);

	if (!project) {
		throw error(404, {
			message: `Project not found`
		});
	}

	return { project };
};
