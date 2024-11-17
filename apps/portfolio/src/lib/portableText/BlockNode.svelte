<script lang="ts">
	import { type ToolkitPortableTextHtmlList } from '@portabletext/toolkit';
	import type { Block } from './types';

	import type { PortableTextBlock } from '@portabletext/types';
	import ListNode from './ListNode.svelte';
	import TextNode from './TextNode.svelte';

	type Props = {
		block: Block;
	};

	const { block }: Props = $props();

	const blockTagMap: { [key: string]: string } = {
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		h5: 'h5',
		h6: 'h6',
		p: 'p',
		normal: 'p',
	};

	function getBlockTag(block: PortableTextBlock) {
		const style = block.style || 'span';

		return blockTagMap[style];
	}

	function isListBlock(block: Block): block is ToolkitPortableTextHtmlList {
		return block._type === '@list' && 'mode' in block && block.mode === 'html';
	}
</script>

{#if isListBlock(block)}
	<ListNode list={block} />
{:else}
	<svelte:element this={getBlockTag(block)}>
		{#each block.children as child (child._key)}
			<TextNode {child} />
		{/each}
	</svelte:element>
{/if}
