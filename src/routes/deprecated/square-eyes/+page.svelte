<script>
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Square Eyes</h1>
		<p>
			This is a website I created for my first year project at my university, Noroff. It is the front-end to a fictional
			streaming service that provides a platform for users to watch movies and TV shows. The website was designed with a
			focus on user experience, featuring a clean, modern design and easy navigation. The website is fully responsive
			and works on all devices.
		</p>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://square-eyes.kyrre.dev"} title={"square-eyes.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/square-eyes" />
	</div>
	<div slot="page-images" class="right-side">
		<Gallery />
	</div>
</ProjectPage>

<style>
</style>
