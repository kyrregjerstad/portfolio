<script lang="ts">
	import { enhance } from '$app/forms';

	type Props = {
		likes: number;
		likeFormAction: {
			likeCount: number;
			message?: string;
		} | null;
	};

	let { likes, likeFormAction }: Props = $props();

	$effect(() => {
		if (likeFormAction) {
			likes = likeFormAction.likeCount;
		}
	});

	const handleMouseDown = () => {
		likes++; // Optimistically increment likes
	};
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<p class="text-foreground break-words text-center text-sm">{likeFormAction?.message}</p>
	<form method="POST" use:enhance class="flex items-center gap-1">
		<div>{likes}</div>
		<button
			onmousedown={handleMouseDown}
			class="aspect-square rounded-md px-2 transition-transform duration-200 hover:scale-110"
			type="submit">❤️</button
		>
	</form>
</div>
