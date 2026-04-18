<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes & {
		label: string;
		issues?: ReadonlyArray<{ message: string }>;
	};

	let { label, issues, ...rest }: Props = $props();
</script>

<div class="grid">
	<label for={rest.name}>
		{label}
	</label>
	<textarea
		{...rest}
		class="border-muted-foreground bg-card focus:border-accent-foreground focus:outline-accent-foreground rounded-sm border p-2"
	></textarea>
	<div>
		{#each issues ?? [] as issue}
			<p class="text-red-500">{issue.message}</p>
		{/each}
	</div>
</div>
