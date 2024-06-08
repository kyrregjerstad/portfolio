<script lang="ts">
	import { type ToolkitPortableTextHtmlList, type ToolkitPortableTextList } from '@portabletext/toolkit';
	import type { PortableTextSpan } from '@portabletext/types';
	import TextNode from './TextNode.svelte';

	type Props = {
		list: ToolkitPortableTextHtmlList;
	};

	const { list }: Props = $props();

	const listMap: { [key: string]: string } = {
		number: 'ol',
		bullet: 'ul',
	};

	function renderListTag(list: ToolkitPortableTextHtmlList): string {
		return listMap[list.listItem];
	}

	function isListBlock(block: PortableTextSpan | ToolkitPortableTextList): block is ToolkitPortableTextHtmlList {
		return block._type === '@list' && 'mode' in block && block.mode === 'html';
	}
</script>

<svelte:element this={renderListTag(list)}>
	{#each list.children as listItem}
		<li>
			{#each listItem.children as child}
				{#if isListBlock(child)}
					<svelte:self list={child} />
				{:else}
					<TextNode {child} />
				{/if}
			{/each}
		</li>
	{/each}
</svelte:element>
