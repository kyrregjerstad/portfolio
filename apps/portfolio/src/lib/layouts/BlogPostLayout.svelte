<script lang="ts" module>
	import pre from '$lib/components/markdown/pre.svelte';
	import code from '$lib/components/markdown/code.svelte';

	export { pre, code };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

{@render children()}
