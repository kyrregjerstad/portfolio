<script lang="ts">
	import { isPortableTextListItemBlock, isPortableTextToolkitList, nestLists } from '@portabletext/toolkit';
	import type { PortableTextBlock } from '@portabletext/types';
	import ListNode from './ListNode.svelte';
	import TextNode from './TextNode.svelte';

	type Props = {
		block: PortableTextBlock;
	};
	const { block }: Props = $props();
	const nestedLists = nestLists([block], 'html');

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
</script>

{#if isPortableTextListItemBlock(block)}
	{#each nestedLists as listItem}
		{#if isPortableTextToolkitList(listItem)}
			<ListNode list={listItem} />
		{/if}
	{/each}
{:else}
	<svelte:element this={getBlockTag(block)}>
		{#each block.children as child}
			<TextNode {child} />
		{/each}
	</svelte:element>
{/if}
