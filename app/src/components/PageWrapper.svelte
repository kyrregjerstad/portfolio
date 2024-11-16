<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="fadeIn">
	{@render children()}
</div>

<style>
	.fadeIn {
		opacity: 1;
		transition: opacity 1s ease-in-out;
	}

	@starting-style {
		.fadeIn {
			opacity: 0;
		}
	}
</style>
