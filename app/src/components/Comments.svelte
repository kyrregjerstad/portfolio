<script lang="ts">
	import type { CommentForm } from '@/lib/schema/CommentForm';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import Comment from './Comment.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';

	type CommentData = {
		id: number;
		author: string;
		content: string;
		createdAt: Date;
	};

	let { commentForm, comments }: { commentForm: SuperValidated<Infer<CommentForm>>; comments: CommentData[] } =
		$props();

	const form = superForm(commentForm, {
		onResult: ({ result }) => {
			if (result.status === 200) {
				toast.success('Comment submitted');
			} else if (result.status === 500) {
				toast.error('Failed to submit comment, please try again later.');
			}
		},
	});

	let { form: formData, enhance, errors } = form;
</script>

<section class="mt-8 flex w-full flex-col items-center">
	<h2 class="mb-4 text-2xl font-bold">Comments</h2>

	<form
		id="contact"
		method="POST"
		use:enhance
		class="mb-8 flex w-full max-w-lg flex-col gap-4"
		action="?/submitComment"
	>
		<Input
			label="Name"
			name="author"
			type="text"
			placeholder="Your name"
			required
			bind:value={$formData.author}
			bind:error={$errors.author}
		/>

		<TextArea
			label="Message"
			name="content"
			placeholder="Your message"
			required
			rows={6}
			bind:value={$formData.content}
			bind:error={$errors.content}
		/>

		<!-- 🍯 honeypot 🤖 -->
		<div class="absolute opacity-0">
			<input type="checkbox" id="botCheck" name="botCheck" tabindex="-1" />
			<label for="botCheck"> I'm not a robot </label>
		</div>

		<button
			type="submit"
			class="bg-card border-muted-foreground text-primary-foreground hover:bg-primary/90 rounded-md border px-4 py-2 font-medium transition-colors"
		>
			Submit Comment
		</button>
	</form>

	<div class="w-full max-w-2xl space-y-4">
		{#if comments.length === 0}
			<p class="text-muted-foreground text-center italic">No comments yet. Be the first to comment!</p>
		{:else}
			<h3 class="text-muted-foreground mb-4 text-sm font-medium">
				{comments.length} Comment{comments.length === 1 ? '' : 's'}
			</h3>
			<div class="flex w-full flex-col items-center space-y-4">
				{#each comments as comment (comment.id)}
					<Comment {comment} />
				{/each}
			</div>
		{/if}
	</div>
</section>
