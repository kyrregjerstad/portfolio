<script>
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Tom Wobbe</h1>
		<p>
			A simple photography portfolio website for a local photographer, built in SvelteKit. Draws content from <a
				href="https://www.sanity.io"
			>
				Sanity CMS</a
			> using GROQ.
		</p>
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>CMS integration</li>
				<li>Responsive Design</li>
				<li>SEO Optimized</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://tomwobbe.com"} title={"tomwobbe.com"} />
		<!-- <ViewOnGitHub href="" /> -->
	</div>
	<div slot="page-images" class="right-side">
		<Gallery />
	</div>
</ProjectPage>

<style>
	.key-features {
		display: flex;
		flex-direction: column;
	}
</style>
