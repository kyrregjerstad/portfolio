<script lang="ts">
	import BlockNode from '@/lib/portableText/BlockNode.svelte';
	import { nestLists } from '@portabletext/toolkit';
	import type { PortableTextBlock } from '@portabletext/types';

	type Props = {
		portableText: PortableTextBlock[];
		class?: string;
	};
	let { portableText, class: className }: Props = $props();

	const nestedLists = nestLists(portableText, 'html');
</script>

<div class={className}>
	{#each nestedLists as block}
		<BlockNode {block} />
	{/each}
</div>
