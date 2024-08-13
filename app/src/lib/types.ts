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
