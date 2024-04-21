<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Rainy Days</h1>
		<p>
			Rainy Days is an e-commerce website, showcasing proficiency in SvelteKit. This page serves as a seamless solution
			for online shopping, with emphasis on user experience and responsiveness across various devices. Designed with a
			clean, modern aesthetic and straightforward navigation. The project leverages the efficiency of SvelteKit to
			ensure optimal performance, rapid loading times, and fluid transitions, aligning with the latest web development
			standards.
		</p>
		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>Responsive Design</li>
				<li>Intuitive Navigation</li>
				<li>Advanced Filtering</li>
				<li>Streamlined Checkout Process</li>
				<li>Wishlist Functionality</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://rainy-days.kyrre.dev/"} title={"rainy-days.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/rainy-days" />
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
