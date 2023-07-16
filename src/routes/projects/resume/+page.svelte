<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	// import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";

	// const imagesSrc = [
	// 	"/images/spell/spell-1.webp",
	// 	"/images/spell/spell-2.webp",
	// 	"/images/spell/spell-3.webp",
	// 	"/images/spell/spell-4.webp"
	// ];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Resume</h1>
		<p />
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>User Authentication</li>
				<li>Responsive Design</li>
				<li>User-friendly Interface</li>
			</ul>
		</div>
	</div>
	<ProjectLink url={"https://resume.kyrre.dev"} title={"resume"} slot="page-links" />
	<div slot="page-images" class="right-side">
		<!-- <Gallery {imagesSrc} /> -->
	</div>
</ProjectPage>

<style>
	.key-features {
		display: flex;
		flex-direction: column;
	}
</style>
