<script lang="ts">
	import { page } from '$app/stores';
	import { buttonVariants } from '@/lib/components/ui/button';
	import { getComments, submitComment } from '$lib/remote/comments.remote';
	import { toast } from 'svelte-sonner';
	import Comment from './Comment.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';

	type Props = {
		slug: string;
		isLoggedIn: boolean;
	};

	let { slug, isLoggedIn }: Props = $props();

	const { fields } = submitComment;
	const commentsQuery = $derived(getComments(slug));
</script>

<section class="flex w-full flex-col items-center pb-16">
	<h2 class="mb-4 text-2xl font-bold" id="comments">Comments</h2>

	{#if isLoggedIn}
		<form
			id="contact"
			{...submitComment.enhance(async ({ form, submit }) => {
				try {
					await submit();
					const result = submitComment.result;
					if (result?.ok) {
						form.reset();
						toast.success(result.message);
					} else if (result?.message) {
						toast.error(result.message);
					}
				} catch (e) {
					if (e instanceof Error && e.message.includes('401')) {
						toast.error('You must be logged in to submit a comment.');
					} else {
						toast.error('Failed to submit comment, please try again later.');
					}
				}
			})}
			class="mb-8 flex w-full max-w-lg flex-col gap-4"
		>
			<Input
				label="Display Name"
				placeholder="Display Name (public)"
				required
				{...fields.displayName.as('text')}
				issues={fields.displayName.issues()}
			/>
			<TextArea
				label="Comment"
				placeholder="Your comment"
				required
				rows={6}
				{...fields.content.as('text')}
				issues={fields.content.issues()}
			/>

			<!-- 🍯 honeypot 🤖 -->
			<div class="absolute opacity-0">
				<input {...fields.botCheck.as('checkbox')} tabindex={-1} />
				<label for={fields.botCheck.as('checkbox').name}> I'm not a robot </label>
			</div>

			<button
				type="submit"
				class="bg-card border-muted-foreground text-primary-foreground hover:bg-primary/90 rounded-md border px-4 py-2 font-medium transition-colors disabled:opacity-50"
				disabled={!!submitComment.pending}
			>
				{submitComment.pending ? 'Submitting...' : 'Submit Comment'}
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
		{#if commentsQuery.loading}
			<p class="text-muted-foreground text-center italic">Loading comments...</p>
		{:else if commentsQuery.error}
			<p class="text-muted-foreground text-center italic">Failed to load comments.</p>
		{:else}
			{@const comments = commentsQuery.current ?? []}
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
		{/if}
	</div>
</section>
