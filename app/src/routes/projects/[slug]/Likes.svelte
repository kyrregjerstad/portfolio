<script lang="ts">
	import { enhance } from '$app/forms';

	type Props = {
		likes: number;
	};

	let { likes }: Props = $props();
</script>

<form method="POST" use:enhance class="flex items-center gap-1">
	<div>{likes}</div>
	<button
		onmousedown={() => ++likes}
		class="aspect-square rounded-md px-2 transition-transform duration-200 hover:scale-110"
		type="submit">❤️</button
	>
</form>
