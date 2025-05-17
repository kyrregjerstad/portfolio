<script>
	import Divider from '@/components/Divider.svelte';
	import GitHubIconAnimated from '@/components/icons/GitHubIconAnimated.svelte';
	import LinkedInAnimated from '@/components/icons/LinkedInIconAnimated.svelte';
	import BskyAnimated from '@/components/icons/BskyAnimated.svelte';
	import { HeartIcon } from '@lucide/svelte';
	import posthog from 'posthog-js';
</script>

<Divider class="my-0 sm:my-0" />
<footer class="flex w-full flex-col items-center justify-center gap-8 py-12 text-sm">
	<div class="flex items-center justify-center gap-2">
		<a
			href="https://www.linkedin.com/in/kyrre-gjerstad/"
			target="_blank"
			onclick={() => posthog.capture('social_link_click', { target: 'linkedin', location: 'footer' })}
		>
			<span class="sr-only"> LinkedIn </span>
			<LinkedInAnimated />
		</a>
		<a
			href="https://github.com/kyrregjerstad"
			target="_blank"
			onclick={() => posthog.capture('social_link_click', { target: 'github', location: 'footer' })}
		>
			<span class="sr-only"> GitHub </span>
			<GitHubIconAnimated size={4.5} />
		</a>
		<a
			href="https://bsky.app/profile/kyrre.dev"
			target="_blank"
			class="transition-transform hover:scale-110"
			onclick={() => posthog.capture('social_link_click', { target: 'bsky', location: 'footer' })}
		>
			<span class="sr-only">BSky</span>
			<BskyAnimated size={2.3} />
		</a>
	</div>
	<div class="flex items-center justify-center gap-2">
		<a class="hover:underline" href="/about/kyrregjerstad">About</a>
		<a class="hover:underline" href="/blog">Blog</a>
	</div>

	<p class="">
		Made with <HeartIcon class="fill-foreground inline size-4 -translate-y-px" /> by Kyrre Gjerstad
	</p>
</footer>
