<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { cn } from '@/lib/utils';

	type Props = {
		class?: string;
	};

	const { class: className }: Props = $props();
</script>

<div class={cn('flex items-center space-x-2', className)}>
	<Label for="airplane-mode">Dark Mode</Label>
	<Switch id="airplane-mode" />
</div>
