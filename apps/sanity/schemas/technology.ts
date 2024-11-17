import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'technology',
	title: 'Technology',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'image',
		}),
		defineField({
			name: 'externalLink',
			title: 'External Link',
			type: 'url',
		}),
	],
});
