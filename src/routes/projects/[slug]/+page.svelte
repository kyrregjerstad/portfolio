<script>
	import ProjectLink from "$components/project-pages/ProjectLink.svelte";
	import ProjectPage from "$components/project-pages/ProjectPage.svelte";
	import Gallery from "$components/floating-image-gallery/FloatingGallery.svelte";
	import ViewOnGitHub from "$components/ViewOnGitHub.svelte";

	const imagesSrc = [
		"/images/tom-wobbe/tom-wobbe-1.webp",
		"/images/tom-wobbe/tom-wobbe-2.webp",
		"/images/tom-wobbe/tom-wobbe-3.webp"
	];

	export let data;

	$: ({ project } = data);
</script>

<ProjectPage>
	<div slot="page-text">
		<h1>{project.title}</h1>
		<p>
			{project.description}
		</p>
		{#if project.keyFeatures}
			<div class="key-features">
				<h3>Key Features:</h3>
				<ul>
					{#each project.keyFeatures as feature}
						<li>{feature}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
	<div slot="page-links">
		<ProjectLink url={project.href} title={project.linkTitle} />
		{#if project.gitHubLink}
			<ViewOnGitHub href={project.gitHubLink} />
		{/if}
	</div>
	<div slot="page-images" class="right-side">
		{#if project.images}
			<Gallery images={project.images} />
		{/if}
	</div>
</ProjectPage>

<style>
	.key-features {
		display: flex;
		flex-direction: column;
	}
</style>
