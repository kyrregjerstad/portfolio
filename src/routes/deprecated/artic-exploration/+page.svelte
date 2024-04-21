<script>
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>ARTic Exploration</h1>
		<p>
			This is a single-page application created using vanilla JS. The site features custom web components for the
			navigation, and a pre-loader that gives the page time to fetch all pages before proceeding.
		</p>
		<p>
			The page is built using a custom router, which allows for the user to navigate between pages without having to
			reload the page. The router is built using the History API, which allows for the user to navigate back and forth
			between pages using the browser's back and forward buttons.
		</p>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://artic.kyrre.dev/"} title={"artic.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/ARTic-Exploration" />
	</div>
	<div slot="page-images" class="right-side">
		<Gallery />
	</div>
</ProjectPage>

<style>
</style>
