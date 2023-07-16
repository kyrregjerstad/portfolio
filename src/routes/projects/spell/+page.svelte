<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/spell/spell-1.webp",
		"/images/spell/spell-2.webp",
		"/images/spell/spell-3.webp",
		"/images/spell/spell-4.webp"
	];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>Spell</h1>
		<p>
			As a freelance developer, I worked on the frontend of the Spell website. Spell is a platform that enables users to
			create and utilize prompt libraries and workflows in various AI applications, like ChatGPT and Bing. <br /> Technologies
			used include React, Next.js, Tailwind, and TypeScript.
		</p>
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
		<ProjectLink url={"https://spell.so/"} title={"spell.so"} />
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
