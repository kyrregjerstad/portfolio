<script>
	const { children } = $props();
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex h-full w-full flex-col">
		{@render children()}
	</div>
</div>
