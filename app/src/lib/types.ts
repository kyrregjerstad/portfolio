export type SEO = {
	title: string;

	description: string;
	keywords: string[];
	author: string;

	openGraph: {
		url: string;
		title: string;
		description: string;
		image: string;
	};

	twitter: {
		url: string;
		title: string;
		description: string;
		image: string;
		card: string;
		site: string;
		creator: string;
	};
};

export type Category = 'svelte' | 'testing' | 'javascript';

export type Post = {
	title: string;
	slug: string;
	description: string;
	published: boolean;
	publishedAt: string;
	categories: Category[];
};
