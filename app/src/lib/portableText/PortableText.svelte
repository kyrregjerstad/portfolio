<script lang="ts">
	import BlockNode from '@/lib/portableText/BlockNode.svelte';
	import type { PortableTextType } from './types';

	type Props = {
		portableText: PortableTextType;
		class?: string;
	};
	const { portableText, class: className }: Props = $props();
</script>

<div class={className}>
	{#if Array.isArray(portableText)}
		{#each portableText as block}
			<BlockNode {block} />
		{/each}
	{:else}
		<BlockNode block={portableText} />
	{/if}
</div>
