import type { PortableTextType } from './types';

export const sampleText1 = [
	{
		_type: 'block',
		_key: '779e0cbb146d',
		children: [
			{
				_key: 'c02fc9c07b400',
				_type: 'span',
				text: 'Anshin',
				marks: ['strong'],
			},
			{
				_key: '30bb5b108bf6',
				_type: 'span',
				text: ' is a full-stack e-commerce application I developed for my final year university project. Although the assignment required only a frontend solution, I chose to expand the scope to include both the frontend and backend, aiming to enhance my learning and deepen my understanding of full-stack development.',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_type: 'block',
		_key: '4fc5bbf2e949',
		children: [
			{
				_key: 'aa65384e301d0',
				_type: 'span',
				text: 'The page operates on a ',
				marks: [],
			},
			{
				_key: '4344008d3f9c',
				_type: 'span',
				text: 'MySQL',
				marks: ['strong'],
			},
			{
				_key: '9db2dfcfaca5',
				_type: 'span',
				text: ' database and utilizes Drizzle ORM for effective database management. The application is styled with Tailwind CSS, offering a clean and responsive user interface.',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_type: 'block',
		_key: '2fd9cabd61e9',
		children: [
			{
				_key: '8906ddc1b0a50',
				_type: 'span',
				text: 'In an effort to deepen my technical skills, I developed a custom authentication system for Anshin. This bespoke solution is designed to handle user registrations, logins and sessions securely, providing a solid foundation for protecting user data while personalizing the shopping experience.',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_type: 'block',
		_key: 'bac38e84f91f',
		children: [
			{
				_key: '3107327a9cc10',
				_type: 'span',
				text: 'Redis is used for session management and data caching, enhancing the responsiveness of the application. Docker containers support the development environment, promoting consistency across different setups.',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_type: 'block',
		_key: '72e814d934b4',
		children: [
			{
				_key: '81af72f7e5ca',
				_type: 'span',
				text: '',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_type: 'block',
		_key: 'ed5c0c6a578c',
		children: [
			{
				_key: 'a21f536e5988',
				_type: 'span',
				text: 'one',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
		listItem: 'bullet',
		level: 1,
	},
	{
		_type: 'block',
		_key: '61096ea947b3',
		children: [
			{
				_key: '079043758f4b',
				_type: 'span',
				text: 'two',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
		listItem: 'bullet',
		level: 1,
	},
	{
		_type: 'block',
		_key: '0de0a4bd9640',
		children: [
			{
				_key: '3079c41da7f9',
				_type: 'span',
				text: 'three',
				marks: [],
			},
		],
		markDefs: [],
		style: 'normal',
		listItem: 'bullet',
		level: 1,
	},
] satisfies PortableTextType;

const NATIVE_MARKS = {
	strong: 'strong',
	em: 'em',
	'strike-through': 's',
	underline: 'u',
	code: 'code',
};

const LIST_LEVELS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 4, 3, 2, 1, 1, 1, 2, 2];

const NATIVE_STYLES = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	normal: 'p',
	blockquote: 'blockquote',
};

export const sampleText2: PortableTextType = [
	{
		_key: 'block-0',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Lists',
			},
		],
		markDefs: [],
		style: 'h1',
	},
	{
		_key: 'block-1',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Unordered',
			},
		],
		markDefs: [],
		style: 'h3',
	},
	...LIST_LEVELS.map((level, i) => ({
		_key: `ul-${1 + i}`,
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: `#${i + 1} Unordered - level ${level} `,
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS),
				text: 'all formatting stacked!',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS).reverse(),
				text: 'all formatting stacked (reversed)!',
			},
			{
				_key: 'span-5',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-6',
				_type: 'span',
				marks: ['jkasdjkhasjhkdasjk', ...Object.keys(NATIVE_MARKS)],
				text: 'invalid mark with all formatting',
			},
			{
				_key: 'span-7',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-8',
				_type: 'span',
				marks: ['mark-1', ...Object.keys(NATIVE_MARKS)],
				text: 'custom mark with all formatting',
			},
			{
				_key: 'span-9',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-10',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'jkasdjkhasjhkdasjk'],
				text: 'invalid mark with all formatting (reversed)',
			},
			{
				_key: 'span-11',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-12',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'mark-1'],
				text: 'custom mark with all formatting (reversed)',
			},
			...Object.keys(NATIVE_MARKS).map((mark, idx) => ({
				_key: `span-${13 + idx}`,
				_type: 'span',
				marks: [mark],
				text: mark,
			})),
		],
		markDefs: [
			{
				_key: 'mark-1',
				_type: 'blockAbsUrl',
				url: 'sanity.io',
			},
		],
		style: 'normal',
		level,
		listItem: 'bullet',
	})),
	{
		_key: 'block-3',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Ordered',
			},
		],
		markDefs: [],
		style: 'h3',
	},
	...LIST_LEVELS.map((level, i) => ({
		_key: `ol-${1 + i}`,
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: `#${i + 1} Ordered - level ${level} `,
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS),
				text: 'all formatting stacked!',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS).reverse(),
				text: 'all formatting stacked (reversed)!',
			},
			{
				_key: 'span-5',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-6',
				_type: 'span',
				marks: ['jkasdjkhasjhkdasjk', ...Object.keys(NATIVE_MARKS)],
				text: 'invalid mark with all formatting',
			},
			{
				_key: 'span-7',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-8',
				_type: 'span',
				marks: ['mark-1', ...Object.keys(NATIVE_MARKS)],
				text: 'custom mark with all formatting',
			},
			{
				_key: 'span-9',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-10',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'jkasdjkhasjhkdasjk'],
				text: 'invalid mark with all formatting (reversed)',
			},
			{
				_key: 'span-11',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-12',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'mark-1'],
				text: 'custom mark with all formatting (reversed)',
			},
			...Object.keys(NATIVE_MARKS).map((mark, idx) => ({
				_key: `span-${13 + idx}`,
				_type: 'span',
				marks: [mark],
				text: mark,
			})),
		],
		markDefs: [
			{
				_key: 'mark-1',
				_type: 'blockAbsUrl',
				url: 'sanity.io',
			},
		],
		style: 'normal',
		level,
		listItem: 'number',
	})),
	...LIST_LEVELS.map((level, i) => ({
		_key: `custom-list-${1 + i}`,
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: `#${i + 1} Custom list - level ${level} `,
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS),
				text: 'all formatting stacked!',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS).reverse(),
				text: 'all formatting stacked (reversed)!',
			},
			{
				_key: 'span-5',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-6',
				_type: 'span',
				marks: ['jkasdjkhasjhkdasjk', ...Object.keys(NATIVE_MARKS)],
				text: 'invalid mark with all formatting',
			},
			{
				_key: 'span-7',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-8',
				_type: 'span',
				marks: ['mark-1', ...Object.keys(NATIVE_MARKS)],
				text: 'custom mark with all formatting',
			},
			{
				_key: 'span-9',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-10',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'jkasdjkhasjhkdasjk'],
				text: 'invalid mark with all formatting (reversed)',
			},
			{
				_key: 'span-11',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-12',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'mark-1'],
				text: 'custom mark with all formatting (reversed)',
			},
			...Object.keys(NATIVE_MARKS).map((mark, idx) => ({
				_key: `span-${13 + idx}`,
				_type: 'span',
				marks: [mark],
				text: mark,
			})),
		],
		markDefs: [
			{
				_key: 'mark-1',
				_type: 'blockAbsUrl',
				url: 'sanity.io',
			},
		],
		style: 'normal',
		level,
		listItem: 'customList',
	})),
];

export const sampleText3: PortableTextType = [
	...Object.keys(NATIVE_STYLES).map((style, index) => ({
		_key: `block-${3 + index}`,
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: `Block style: ${style}`,
			},
		],
		markDefs: [],
		style,
	})),
	{
		_key: 'ol-0',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Ordered lists 1',
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: [],
				text: 'Ordered lists 2',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: 'Ordered lists 3',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: [],
				text: 'Ordered lists 4',
			},
		],
		markDefs: [],
		listItem: 'number',
		level: 1,
	},
	{
		_key: 'ol-1',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'With nested children',
			},
		],
		markDefs: [],
		listItem: 'number',
		level: 2,
	},
	{
		_key: 'ol-2',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'And siblings!',
			},
		],
		markDefs: [],
		listItem: 'number',
		level: 1,
	},
	{
		_key: 'ul-0',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Unordered lists',
			},
		],
		markDefs: [],
		listItem: 'bullet',
		level: 1,
	},
	{
		_key: 'ul-1',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'With nested children',
			},
		],
		markDefs: [],
		listItem: 'bullet',
		level: 2,
	},
	{
		_key: 'ul-2',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'And siblings!',
			},
		],
		markDefs: [],
		listItem: 'bullet',
		level: 1,
	},
	{
		_key: 'formatting-heading',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Rich-text formatting',
			},
		],
		markDefs: [],
		style: 'h2',
	},
	{
		_key: 'formatting-1',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Paragraph 1 (individual formatting): ',
			},
			...Object.keys(NATIVE_MARKS).map((mark, idx) => ({
				_key: `span-${2 + idx}`,
				_type: 'span',
				marks: [mark],
				text: mark,
			})),
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_key: 'formatting-2',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Paragraph 2: ',
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS),
				text: 'all formatting stacked!',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: Object.keys(NATIVE_MARKS).reverse(),
				text: 'all formatting stacked (reversed)!',
			},
		],
		markDefs: [],
		style: 'normal',
	},
	{
		_key: 'formatting-3',
		_type: 'block',
		children: [
			{
				_key: 'span-1',
				_type: 'span',
				marks: [],
				text: 'Paragraph 3: ',
			},
			{
				_key: 'span-2',
				_type: 'span',
				marks: ['jkasdjkhasjhkdasjk'],
				text: 'invalid mark',
			},
			{
				_key: 'span-3',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-4',
				_type: 'span',
				marks: ['mark-1'],
				text: 'unknown mark',
			},
			{
				_key: 'span-5',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-6',
				_type: 'span',
				marks: ['jkasdjkhasjhkdasjk', ...Object.keys(NATIVE_MARKS)],
				text: 'invalid mark with all formatting',
			},
			{
				_key: 'span-7',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-8',
				_type: 'span',
				marks: ['mark-1', ...Object.keys(NATIVE_MARKS)],
				text: 'unknown mark with all formatting',
			},
			{
				_key: 'span-9',
				_type: 'span',
				marks: [],
				text: ', ',
			},
			{
				_key: 'span-10',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'jkasdjkhasjhkdasjk'],
				text: 'invalid mark with all formatting (reversed)',
			},
			{
				_key: 'span-11',
				_type: 'span',
				marks: [],
				text: ' & ',
			},
			{
				_key: 'span-12',
				_type: 'span',
				marks: [...Object.keys(NATIVE_MARKS), 'mark-1'],
				text: 'unknown mark with all formatting (reversed)',
			},
		],
		markDefs: [
			{
				_key: 'mark-1',
				_type: 'blockAbsUrl',
				url: 'sanity.io',
			},
		],
		style: 'normal',
	},
];
