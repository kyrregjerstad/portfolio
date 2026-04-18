<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		label: string;
		issues?: ReadonlyArray<{ message: string }>;
	};

	let { label, issues, ...rest }: Props = $props();
</script>

<div class="grid">
	<label for={rest.name}>
		{label}
	</label>
	<input
		{...rest}
		class="bg-card border-muted-foreground focus:border-accent-foreground focus:outline-accent-foreground rounded-sm border p-2"
	/>
	<div>
		{#each issues ?? [] as issue}
			<p class="text-red-500">{issue.message}</p>
		{/each}
	</div>
</div>
