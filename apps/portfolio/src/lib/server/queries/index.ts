import type * as SanityTypes from '@/lib/services/sanity.types';
import { createGroqBuilder } from 'groqd';

const q = createGroqBuilder<{
	schemaTypes: SanityTypes.AllSanitySchemaTypes;
	referenceSymbol: typeof SanityTypes.internalGroqTypeReferenceTo;
}>();

export const projectQuery = q
	.parameters<{ slug: string }>()
	.star.filterByType('project')
	.filterBy('slug.current == $slug')
	.slice(0)
	.project((sub) => ({
		title: true,
		description: true,
		richDescription: true,
		href: true,
		linkTitle: true,
		gitHubLink: true,
		client: true,
		keyFeatures: true,
		images: sub
			.field('images[]')
			.project((sub) => ({
				media: sub.field('asset').deref().project({
					url: true,
				}),
				asset: sub.field('asset').deref().project({
					url: true,
					metadata: true,
				}),
			}))
			.transform((data) => {
				return data ?? [];
			}),
		type: true,
		technologies: sub
			.field('technologies[]')
			.deref()
			.project({
				title: true,
			})
			.notNull(),
	}))
	.notNull();

export const homePageQuery = q.star
	.filterByType('page')
	.filterBy(`title == "Home"`)
	.slice(0)
	.project((sub) => ({
		projects: sub
			.field('projects[]')
			.deref()
			.project({
				title: true,
				slug: 'slug.current',
			})
			.notNull(),
	}))
	.transform((data) => {
		type Project = {
			title: string;
			slug: string;
		};
		const projects =
			(data?.projects.map((project) => project).filter((p) => p.slug !== null && p.title !== null) as Project[]) ??
			([] as Project[]);

		return projects;
	});

export const allProjectsQuery = q.star
	.filterByType('page')
	.filterBy('title == "Home"')
	.slice(0)
	.project((sub) => ({
		projects: sub
			.field('projects[]')
			.deref()
			.project({
				title: true,
				slug: 'slug.current',
			})
			.notNull(),
	}))
	.notNull();
