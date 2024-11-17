<script lang="ts">
	import type { PortableTextBlock } from '@portabletext/types';

	type Props = {
		child: PortableTextBlock['children'][number];
	};

	const { child }: Props = $props();

	const markTagMap: { [key: string]: string } = {
		strong: 'strong',
		em: 'em',
		'strike-through': 'del',
		underline: 'u',
		code: 'code',
		normal: 'span',
	};

	function getTag(mark: string) {
		return markTagMap[mark] || 'span';
	}
</script>

{#if child.marks && child.marks.length > 0}
	<svelte:element this={getTag(child.marks[0])}>
		<svelte:self child={{ ...child, marks: child.marks.slice(1) }} />
	</svelte:element>
{:else}
	{child.text}
{/if}
