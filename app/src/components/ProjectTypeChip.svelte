<script lang="ts">
	import Chip from '@/components/Chip.svelte';
	import { GraduationCap, Handshake, Heart } from 'lucide-svelte';

	type Props = {
		type: string;
	};

	const { type }: Props = $props();
</script>

<Chip class="flex gap-2">
	{#if type === 'personal'}
		<Heart class="size-4 sm:size-6" />
	{:else if type === 'professional'}
		<Handshake class="size-4 sm:size-6" />
	{:else if type === 'academic'}
		<GraduationCap class="size-4 sm:size-6" />
	{/if}
	{type}
</Chip>
