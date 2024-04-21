<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Futeum</h1>
		<p>
			Futeum is a community science museum website that I created for my semester project at my university, Noroff. It
			provides a platform for the museum to share the latest news, events, and exhibits with the public. The website was
			designed with a focus on user experience, featuring a clean, modern design and easy navigation.
		</p>
		<h3>Key Features:</h3>
		<ul>
			<li>Latest news and updates from the museum</li>
			<li>Information about current and upcoming exhibits</li>
			<li>Event calendar and registration system</li>
			<li>Contact information and directions to the museum</li>
			<li>Responsive design for optimal viewing on all devices</li>
		</ul>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://futeum.kyrre.dev/"} title={"futeum.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/Futeum" />
	</div>
	<div slot="page-images" class="right-side">
		<Gallery />
	</div>
</ProjectPage>

<style>
</style>
