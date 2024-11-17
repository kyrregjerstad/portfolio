<script lang="ts">
	import { scrollToTop } from '@/lib/utils';

	type Props = {
		items: {
			title: string;
			slug: string;
		}[];
	};

	const { items }: Props = $props();
</script>

<ul class="flex flex-col gap-2 font-mono sm:gap-1">
	{#each items as item}
		<li
			class="hover:text-accent-foreground group inline w-fit transition-transform hover:translate-x-2 hover:font-bold hover:italic"
		>
			<span class="group-hover:hidden">&bull;</span>
			<span class="hidden group-hover:inline-block">&raquo;</span>
			<a href={item.slug} onclick={scrollToTop}>
				{item.title}
			</a>
		</li>
	{/each}
</ul>
