<script lang="ts">
	import BskyAnimated from '@/components/icons/BskyAnimated.svelte';
	import GitHubIconAnimated from '@/components/icons/GitHubIconAnimated.svelte';
	import LinkedInAnimated from '@/components/icons/LinkedInIconAnimated.svelte';
	import { buttonVariants } from '@/lib/components/ui/button';
	import { MapPin } from 'lucide-svelte';
	import posthog from 'posthog-js';
</script>

<div class="sticky top-16 mx-auto h-full w-full max-w-7xl sm:top-16">
	<div
		class="relative flex min-h-[calc(100dvh_+_4rem)] w-full flex-col sm:min-h-[calc(100dvh_-_8rem)] sm:justify-center sm:py-8"
	>
		<div class="hero-text flex flex-col gap-8 sm:text-justify">
			<div>
				<h1
					class="flex items-end gap-2 text-pretty break-words text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl"
				>
					Hei, I'm Kyrre!
				</h1>
				<span class="flex items-center gap-1 text-pretty text-sm font-normal">
					<MapPin size={12} />
					Berlin
				</span>
			</div>

			<h2 class="text-pretty text-lg lg:text-xl">
				I build full-stack web applications with TypeScript, specializing in <strong>SvelteKit</strong> and
				<strong>Next.js</strong>.
			</h2>
			<!-- TODO: idea - make the text crumble or some other effect when the gradient comes over the text -->
			<p class="prose text-lg">
				I develop clean, performant solutions that solve real business problems. My work spans from crafting intuitive
				user interfaces to designing scalable backend systems. Check out my projects below to see how I've helped
				companies ship better products faster.
			</p>

			<div class="flex items-center gap-3">
				<a
					href="https://github.com/kyrregjerstad"
					target="_blank"
					class="transition-transform hover:scale-110"
					onclick={() => posthog.capture('click_github')}
				>
					<span class="sr-only">GitHub</span>
					<GitHubIconAnimated size={2.5} />
				</a>
				<a
					href="https://www.linkedin.com/in/kyrre-gjerstad/"
					target="_blank"
					class="transition-transform hover:scale-110"
					onclick={() => posthog.capture('click_linkedin')}
				>
					<span class="sr-only">LinkedIn</span>
					<LinkedInAnimated size={2.5} />
				</a>
				<a
					href="https://bsky.app/profile/kyrre.dev"
					target="_blank"
					class="transition-transform hover:scale-110"
					onclick={() => posthog.capture('click_bsky')}
				>
					<span class="sr-only">BSky</span>
					<BskyAnimated size={2.3} />
				</a>
			</div>
			<a href="#contact" class={buttonVariants({ class: 'text-background  sm:self-start' })}> Get in touch </a>
		</div>
	</div>
</div>

<style>
	.hero-text {
		opacity: 1;
		transition: opacity 1s 3s ease-in-out;
	}

	@starting-style {
		:global([data-firstVisit='true'] .hero-text) {
			opacity: 0;
		}
	}
</style>
