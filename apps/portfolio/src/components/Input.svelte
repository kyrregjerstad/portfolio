<script lang="ts">
	type Props = {
		label: string;
		name: string;
		type: string;
		placeholder: string;
		required: boolean;
		value: string | number | boolean | null | undefined;
		error: string[] | undefined;
	};

	let { label, name, type, placeholder, required, value = $bindable(), error = $bindable() }: Props = $props();
</script>

<div class="grid">
	<label for={name}>
		{label}
	</label>
	<input
		{type}
		{name}
		id={name}
		{placeholder}
		{required}
		bind:value
		class="bg-card border-muted-foreground focus:border-accent-foreground focus:outline-accent-foreground rounded-sm border p-2"
	/>
	<div>
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
	</div>
</div>
