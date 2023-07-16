<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/plugin-surf/plugin-surf-1.webp",
		"/images/plugin-surf/plugin-surf-2.webp",
		"/images/plugin-surf/plugin-surf-3.webp"
	];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Plugin Surf</h1>
		<p>Hired as a freelance developer to do parts of the frontend development for Plugin Surf in NextJS.</p>
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>User Authentication</li>
				<li>Responsive Design</li>
				<li>User-friendly Interface</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://plugin.surf/"} title={"plugin.surf"} />
		<!-- <ViewOnGitHub href="" /> -->
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
