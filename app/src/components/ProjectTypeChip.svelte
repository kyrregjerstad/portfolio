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
		<Heart size={20} />
	{:else if type === 'professional'}
		<Handshake size={20} />
	{:else if type === 'academic'}
		<GraduationCap size={20} />
	{/if}
	{type}
</Chip>
