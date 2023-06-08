<script lang="ts">
	export let errors: string[] | undefined = [];
</script>

<div class="container" class:error={errors}>
	{#if errors}
		{#each errors as error}
			<span>{error}</span>
		{/each}
	{/if}
</div>

<style>
	span {
		color: red;
		overflow: hidden;
	}

	.container {
		display: grid;
		grid-template-rows: 0fr;
		transition: all 250ms ease-in-out;
	}

	.container.error {
		grid-template-rows: 1fr;
	}
</style>
