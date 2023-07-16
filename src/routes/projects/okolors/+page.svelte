<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/okolors/okolors-1.webp",
		"/images/okolors/okolors-2.webp",
		"/images/okolors/okolors-3.webp"
	];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>OKolors</h1>
		<p>
			OKolors is a color palette tool for the CSS OKLCH format. With a simple brand color input, it generates
			corresponding CSS for integration into your design system. It also allows you to save and share your color
			presets. OKolor's streamlined interface is built with SvelteKit and SkeletonUI, while Supabase handles the
			backend. The robust application is further secured with TypeScript, demonstrating modern web development
			capabilities.
		</p>
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>User Authentication</li>
				<li>Color Palette Generation</li>
				<li>Preset Sharing</li>
				<li>Robust Backend</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://okolors.com"} title={"okolors.com"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/OKolors" />
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
