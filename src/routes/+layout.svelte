<script lang="ts">
	import "../styles/style.postcss";
	import "@fontsource/material-icons-outlined";
	import ThemeSwitcher from "$components/ThemeSwitcher.svelte";
	import BackButton from "$components/BackButton.svelte";
	import PageTransition from "$components/PageTransition.svelte";
	import { page } from "$app/stores";
	import { scrollPosition } from "$stores/scroll";
	import OpenGraph from "$components/SEO/OpenGraph.svelte";

	export let data;

	let main: HTMLElement | null;

	function handleScroll() {
		if (main) {
			scrollPosition.set(main.scrollTop);
		}
	}

	// quick way to make sure the page is scrolled to the top when navigating
	// also stops the page from scrolling to the top when submitting a form
	let currentPage: string | null = "/";
	page.subscribe((e) => {
		if (main) {
			if (currentPage !== e.route.id) {
				main.scrollTo(0, 0);
			}
		}
		currentPage = e.route.id;
	});
</script>

<svelte:head>
	<script defer data-domain="kyrre.dev" src="https://analytics.kyrre.dev/js/script.js"></script>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<title>Kyrre.dev</title>
<OpenGraph />
<main class="page" on:scroll={handleScroll} bind:this={main}>
	{#if $page.route.id !== "/"}
		<BackButton />
	{/if}
	<ThemeSwitcher fontSize={16} />
	<PageTransition pathname={data.pathname}>
		<slot />
	</PageTransition>
</main>

<style lang="postcss">
	main {
		position: relative;
		border: solid 2px var(--font-color, #ffffe3);
		height: 100%;
		padding: 1rem;
		overflow: auto;
		transition: border var(--transition-time) ease-in-out;

		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox */
	}

	main::-webkit-scrollbar {
		display: none; /* Safari and Chrome */
	}

	@media (min-width: 45rem) {
		main {
			padding: 1rem 5rem;
		}
	}
</style>
