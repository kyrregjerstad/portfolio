<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/ai-web/ai-web-1.webp",
		"/images/ai-web/ai-web-2.webp",
		"/images/ai-web/ai-web-3.webp",
		"/images/ai-web/ai-web-4.webp"
	];
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>AI // WEB</h1>
		<p>
			AI // WEB, was my first-year examination project at Noroff University. As a frontend development student, I've
			brought together my skills and creativity to build an AI-powered blog that's not just about tech, but the
			intersection of technology and the human spirit.
		</p>
		<p>
			What sets this project apart is not just the AI integration, but also the personalized experience I've built in,
			allowing you to adjust color schemes, font sizes, and engage via a ChatGPT-moderated comment section.
		</p>

		<div class="key-features">
			<h3>Key Features:</h3>
			<ul>
				<li>Customizable interface</li>
				<li>Strapi CMS integration</li>
				<li>Comment feature</li>
				<li>Automatic comment moderation</li>
			</ul>
		</div>
	</div>
	<div slot="page-links">
		<ProjectLink url={"https://blog.kyrre.dev/"} title={"blog.kyrre.dev"} />
		<ViewOnGitHub href="https://github.com/kyrregjerstad/noroff-exam-blog-year-1" />
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
