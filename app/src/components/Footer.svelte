<script>
	import Divider from '@/components/Divider.svelte';
	import GitHubIconAnimated from '@/components/icons/GitHubIconAnimated.svelte';
	import LinkedInAnimated from '@/components/icons/LinkedInIconAnimated.svelte';
	import TwitterIconAnimated from '@/components/icons/TwitterIconAnimated.svelte';
</script>

<Divider />
<footer class="flex w-full flex-col items-center justify-center gap-4 text-sm">
	<div class="flex items-center justify-center gap-2">
		<a href="https://www.linkedin.com/in/kyrre-gjerstad/" target="_blank">
			<span class="sr-only"> LinkedIn </span>
			<LinkedInAnimated />
		</a>
		<a href="https://github.com/kyrregjerstad" target="_blank">
			<span class="sr-only"> GitHub </span>
			<GitHubIconAnimated size={4.5} />
		</a>
		<a href="https://www.twitter.com/kyrregjerstad" target="_blank">
			<span class="sr-only"> Twitter </span>
			<TwitterIconAnimated />
		</a>
	</div>
	<p>Made with ❤️ by Kyrre Gjerstad</p>
</footer>
