<script lang="ts">
	import { cn } from '@/lib/utils/cn';

	type Props = {
		class?: string;
	};
	const { class: className }: Props = $props();
</script>

<hr class={cn('border-foreground my-12 opacity-50', className)} />
