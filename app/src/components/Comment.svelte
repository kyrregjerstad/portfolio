<script lang="ts">
	import { formatDate } from '@/lib/utils';

	type CommentData = {
		id: number;
		displayName: string;
		content: string;
		createdAt: Date;
	};

	let { comment }: { comment: CommentData } = $props();
</script>

<div class="bg-card border-muted-foreground w-full rounded-sm border p-6 shadow-sm">
	<div class="flex-1">
		<div class="flex items-center justify-between">
			<h4 class="font-semibold">{comment.displayName}</h4>
			<time class="text-muted-foreground text-sm" datetime={comment.createdAt.toISOString()}>
				{formatDate(comment.createdAt)}
			</time>
		</div>
		<p class="text-muted-foreground mt-1 text-sm">{comment.content}</p>
	</div>
</div>
