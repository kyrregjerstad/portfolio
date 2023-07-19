<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = ["/images/rename/rename-1.webp"];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>R.E.N.A.M.E</h1>
		<p>
			R.E.N.A.M.E is a web application that simplifies the process of renaming assignments according to the guidelines
			set by Noroff University. By automating this time-consuming and error-prone task, RENAME helps students avoid
			mistakes and ensures their files are accurately named every time. With a user-friendly interface and input
			validation, RENAME is fast, efficient, and easy to use.
		</p>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://rename.noroff.dev/"} title={"rename.noroff.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/RENAME" />
	</div>
	<div slot="page-images" class="right-side">
		<Gallery {imagesSrc} />
	</div>
</ProjectPage>

<style>
</style>
