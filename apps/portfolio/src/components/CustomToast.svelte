<script lang="ts">
	type Props = {
		title?: string;
		message?: string;
		error?: boolean;
	};
	const { title, message, error }: Props = $props();
</script>

<div class="bg-background text-foreground border-primary flex flex-col gap-2 border p-6">
	<h3>{title}</h3>
	<div>
		<p>{message}</p>
	</div>
</div>
