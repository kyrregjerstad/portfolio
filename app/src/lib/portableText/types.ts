import { nestLists } from '@portabletext/toolkit';
import type { PortableTextBlock } from '@portabletext/types';

export type PortableTextType = PortableTextBlock | PortableTextBlock[];

export type NormalizedBlocks = ReturnType<typeof nestLists>;
