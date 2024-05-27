<script lang="ts">
	import { isPortableTextToolkitList, type ToolkitPortableTextHtmlList } from '@portabletext/toolkit';
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
</script>

<svelte:element this={renderListTag(list)}>
	{#each list.children as listItem (listItem._key)}
		{#each listItem.children as child (child._key)}
			<!-- This is never true... -->
			{#if isPortableTextToolkitList(child)}
				<li>
					<svelte:self list={child} />
				</li>
			{:else}
				<li>
					<TextNode {child} />
				</li>
			{/if}
		{/each}
	{/each}
</svelte:element>
