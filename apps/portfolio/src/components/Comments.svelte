<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '@/lib/components/ui/button';
	import { fetchComments, type FetchComments } from '@/lib/getComments';
	import type { CommentForm } from '@/lib/schema/CommentForm';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import Comment from './Comment.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';
	import { onMount } from 'svelte';

	type Props = {
		commentForm: SuperValidated<Infer<CommentForm>>;
		postId: string;
		isLoggedIn: boolean;
	};

	let { commentForm, postId, isLoggedIn }: Props = $props();
	let comments = $state<FetchComments>([]);

	onMount(async () => {
		comments = await fetchComments(postId);
	});

	const form = superForm(commentForm, {
		onResult: async ({ result }) => {
			if (result.status === 200) {
				toast.success('Comment submitted');
				comments = await fetchComments(postId);
			} else if (result.status === 401) {
				toast.error('You must be logged in to submit a comment.');
			} else {
				toast.error('Failed to submit comment, please try again later.');
			}
		},
	});

	let { form: formData, enhance, errors, submitting } = form;
</script>

<section class="flex w-full flex-col items-center pb-16">
	<h2 class="mb-4 text-2xl font-bold" id="comments">Comments</h2>

	{#if isLoggedIn}
		<form
			id="contact"
			method="POST"
			use:enhance
			class="mb-8 flex w-full max-w-lg flex-col gap-4"
			action="?/submitComment"
		>
			<Input
				label="Display Name"
				name="displayName"
				type="text"
				placeholder="Display Name (public)"
				required
				bind:value={$formData.displayName}
				bind:error={$errors.displayName}
			/>
			<TextArea
				label="Comment"
				name="content"
				placeholder="Your comment"
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
				class="bg-card border-muted-foreground text-primary-foreground hover:bg-primary/90 rounded-md border px-4 py-2 font-medium transition-colors disabled:opacity-50"
				disabled={$submitting}
			>
				{$submitting ? 'Submitting...' : 'Submit Comment'}
			</button>
		</form>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<p class="text-muted-foreground">Join the conversation</p>
			<a class={buttonVariants({ variant: 'outline' })} href="/login/github?returnTo={$page.url.pathname}#comments">
				Sign in with GitHub
			</a>
		</div>
	{/if}

	<div class="w-full max-w-2xl space-y-4">
		{#await comments}
			<p class="text-muted-foreground text-center italic">Loading comments...</p>
		{:then comments}
			{#if comments.length === 0}
				<p class="text-muted-foreground py-8 text-center italic">No comments yet. Be the first to comment!</p>
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
		{/await}
	</div>
</section>
