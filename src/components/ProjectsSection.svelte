<script lang="ts">
	import type { Project } from "$lib/services/queries/pageQuery";
	export let projects: Project[] = [];
</script>

<section>
	<h2>Projects:</h2>
	<ul>
		{#each projects as project}
			<li><a href="./projects/{project.slug.current}">{project.title}</a></li>
		{/each}
	</ul>
</section>

<style lang="postcss">
	li {
		transition: all calc(var(--transition-time) / 4) ease-in-out;
	}

	li:has(a:hover) {
		transform: translate(0.5rem, 0);
		font-variation-settings: var(--font-hover-settings);
	}

	li:has(a:hover)::marker {
		content: "> ";
	}
</style>
