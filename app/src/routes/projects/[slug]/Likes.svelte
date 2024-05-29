<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	type Props = {
		likes: number;
		likeFormAction: {
			success: boolean;
			likeCount: number;
			message?: string;
		} | null;
	};

	let { likes, likeFormAction }: Props = $props();

	$inspect('like button', likeFormAction?.success);

	$effect(() => {
		if (likeFormAction) {
			likes = likeFormAction.likeCount;
		}
	});

	const handleMouseDown = () => {
		console.log('like button clicked');
		likes++; // Optimistically increment likes
	};
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<form method="POST" use:enhance class="flex items-center gap-1">
		<div>{likes}</div>
		<button
			onmousedown={handleMouseDown}
			class="aspect-square rounded-md px-2 transition-transform duration-200 hover:scale-110"
			type="submit">❤️</button
		>
	</form>
	<p class="text-foreground break-words text-center text-sm">{likeFormAction?.message}</p>
</div>
