import { q, type InferType } from "groqd";

export const aboutQuery = q("*")
	.filterByType("page")
	.filter("title == 'About'")
	.slice(0)
	.grab({
		text: q("text")
			.filter()
			.slice(0)
			.grab({
				children: q("children").filter().slice(0).grab({
					text: q.string()
				})
			})
	});

export type About = InferType<typeof aboutQuery>;
