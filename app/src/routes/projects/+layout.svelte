<script>
	const { children } = $props();
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex h-full w-full max-w-7xl flex-col py-8">
		{@render children()}
	</div>
</div>
