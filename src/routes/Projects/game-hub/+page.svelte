<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/game-hub/game-hub-1.webp",
		"/images/game-hub/game-hub-2.webp",
		"/images/game-hub/game-hub-3.webp"
	];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Game Hub</h1>
		<p>
			A project I used to learn React, Zustand and Chakra UI. The page pulls data from the RAWG API and allows the user
			to search for games and filter by platforms and categories.
		</p>
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>Built in React</li>
				<li>Using Zustand for state management</li>
				<li>React Query for caching</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://gamehub.kyrre.dev"} title={"gamehub.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/game-hub" />
	</div>
	<div slot="page-images" class="right-side">
		<Gallery {imagesSrc} />
	</div>
</ProjectPage>

<style>
	.key-features {
		display: flex;
		flex-direction: column;
	}
</style>
