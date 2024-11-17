import { nestLists, type ToolkitPortableTextHtmlList } from '@portabletext/toolkit';
import type {
	ArbitraryTypedObject,
	PortableTextBlock,
	PortableTextMarkDefinition,
	PortableTextSpan,
} from '@portabletext/types';

export type PortableTextType = PortableTextBlock | PortableTextBlock[];

export type NormalizedBlocks = ReturnType<typeof nestLists>;

export type Block =
	| PortableTextBlock<PortableTextMarkDefinition, ArbitraryTypedObject | PortableTextSpan, string, string>
	| ToolkitPortableTextHtmlList;
