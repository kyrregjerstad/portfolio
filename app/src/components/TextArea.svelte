<script lang="ts">
	type Props = {
		label: string;
		name: string;
		rows?: number;
		placeholder: string;
		required: boolean;
		value: string | number | boolean | null | undefined;
		error: string[] | undefined;
	};

	let { label, name, rows, placeholder, required, value = $bindable(), error = $bindable() }: Props = $props();
</script>

<div class="grid">
	<label for={name}>
		{label}
	</label>
	<textarea
		{name}
		id={name}
		{placeholder}
		{required}
		bind:value
		{rows}
		class="bg-background border-muted-foreground focus:border-accent-foreground focus:outline-accent-foreground border p-2"
	>
	</textarea>
	<div>
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
	</div>
</div>
