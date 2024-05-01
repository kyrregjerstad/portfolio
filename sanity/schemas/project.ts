import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			validation: (Rule) => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
		}),
		defineField({
			name: 'href',
			title: 'href',
			type: 'url',
		}),
		defineField({
			name: 'linkTitle',
			title: 'Link Title',
			type: 'string',
		}),
		defineField({
			name: 'gitHubLink',
			title: 'GitHub Link',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
		}),
		defineField({
			name: 'shortDescription',
			title: 'Short Description',
			type: 'text',
		}),
		defineField({
			name: 'keyFeatures',
			title: 'Key Features',
			type: 'array',
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [{ type: 'image' }],
		}),
		defineField({
			name: 'color',
			title: 'Color',
			type: 'string',
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO Title',
			type: 'string',
		}),
		defineField({
			name: 'seoDescription',
			title: 'SEO Description',
			type: 'string',
		}),
		defineField({
			name: 'seoKeywords',
			title: 'SEO Keywords',
			type: 'array',
			of: [{ type: 'string' }],
		}),
	],

	preview: {
		select: {
			title: 'title',
			media: 'images',
		},
	},
});
