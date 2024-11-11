<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		min: number;
		max: number;
		value: number;
	};

	let { min, max, value = $bindable(0), ...restProps }: Props = $props();
</script>

<input type="range" bind:value {min} {max} class="w-full" {...restProps} />
