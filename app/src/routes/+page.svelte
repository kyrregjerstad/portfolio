<script lang="ts">
	import ContactForm from '@/components/ContactForm.svelte';
	import Divider from '@/components/Divider.svelte';

	import { spring } from 'svelte/motion';

	const { data } = $props();

	const { contactForm } = data;
	const { projects, heading, description } = data.page;

	let { innerWidth, innerHeight } = $state({ innerWidth: 0, innerHeight: 0 });
	const blobX = spring(0, { stiffness: 0.001, damping: 0.09 });
	const blobY = spring(0, { stiffness: 0.001, damping: 0.09 });

	$inspect({ $blobX, $blobY });

	function updateBlobPosition(clientX: number, clientY: number) {
		const divide = 4;

		const centerX = innerWidth / 2;
		const centerY = innerHeight / 2;

		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;

		blobX.set(-deltaX / divide);
		blobY.set(-deltaY / divide);
	}
</script>

<svelte:window
	on:mousemove|passive={({ clientX, clientY }) => {
		updateBlobPosition(clientX, clientY);
	}}
	bind:innerWidth
	bind:innerHeight
/>

<div class="relative flex min-h-[calc(100dvh_-_12rem)] w-full flex-col justify-center">
	<div>
		<h1 class="flex-1 text-pretty break-words text-6xl font-bold tracking-tight">Hei, I'm Kyrre!</h1>
		<h2 class="text-pretty break-words pb-8 text-xl tracking-tight">
			A fullstack typescript developer specialized in SvelteKit and NextJS.
		</h2>
		<p class="prose">
			I'm a frontend-focused fullstack developer from Norway, passionate about crafting visually appealing and
			functional products with a great user experience. My stack of choice is NextJS or SvelteKit with TypesScript and
			Tailwind, depending on the project's needs. Whether building complex web applications or optimizing existing
			platforms, I bring a keen eye for detail and a commitment to clean, efficient code. Check out my portfolio below
			to see a mix of professional and academic projects I've worked on.
		</p>
	</div>
	<div class="blobs-wrapper" style:--x="{$blobX}px" style:--y="{$blobY}px">
		<div class="blob" id="blob-1" style:--scale-min="0.95" style:--scale-max="1.15" style:--animation-duration="10s">
			<div class="blob-inner"></div>
		</div>
		<div
			class="blob"
			id="blob-2"
			style:--offsetX="{$blobX * 0.4}px"
			style:--offsetY="{$blobY * 0.4}px"
			style:--scale-min="0.9"
			style:--scale-max="1.3"
			style:--animation-duration="8s"
		>
			<div class="blob-inner"></div>
		</div>
		<div
			class="blob"
			id="blob-3"
			style:--offsetX="{$blobX * 0.8}px"
			style:--offsetY="{$blobY * 0.8}px"
			style:--scale-min="1"
			style:--scale-max="1.2"
			style:--animation-duration="6s"
		>
			<div class="blob-inner"></div>
		</div>
	</div>
</div>
<Divider />
<h2 class="pb-4 text-3xl font-bold">Projects</h2>
<ul class="flex flex-col gap-2 sm:gap-1">
	{#each projects as project}
		<li
			class="hover:text-accent-foreground group inline w-fit transition-transform hover:translate-x-2 hover:font-bold hover:italic"
		>
			<span class="group-hover:hidden">&bull;</span>
			<span class="hidden group-hover:inline-block">&raquo;</span>
			<a href="projects/{project.slug}">
				{project.title}
			</a>
		</li>
	{/each}
</ul>
<Divider />
<section>
	<h2 class="pb-4 text-3xl font-bold">Contact</h2>
	<ContactForm {contactForm} />
</section>

<style>
	.blobs-wrapper {
		--x: 0px;
		--y: 0px;
		position: absolute;
		right: 25%;
		top: 30%;
		opacity: 0.8;
		transform: translate(var(--x), var(--y));
		filter: blur(20px);
	}

	.blob {
		--animation-duration: 5s;

		position: absolute;
		filter: blur(20px);
		z-index: -1;
		mix-blend-mode: overlay;
		animation:
			breathe var(--animation-duration) infinite alternate ease-in-out,
			move 20s infinite alternate ease-in-out,
			fade 10s var(--animation-duration) infinite alternate ease-in-out;
	}

	.blob-inner {
		aspect-ratio: 1;
		width: 350px;
	}

	#blob-1 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		background: linear-gradient(30deg, oklch(69% 0.286 360) 0%, oklch(50% 0.286 360) 100%);
	}

	#blob-2 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		transform: translate(var(--offsetX), var(--offsetY));

		background: linear-gradient(60deg, oklch(50% 0.1 190) 0%, oklch(65.41% 0.111 202) 100%);
	}

	#blob-3 {
		--offsetX: 0px;
		--offsetY: 0px;
		filter: blur(20px);

		transform: translate(var(--offsetX), var(--offsetY));
		background: linear-gradient(90deg, oklch(30% 0.2 220.24) 0%, oklch(30% 0.4 309) 100%);
	}

	@keyframes move {
		0% {
			translate: 0% 0%;
			border-radius: 60% 40% 30% 70% / 100% 85% 92% 74%;
		}
		50% {
			translate: -5% 15%;
			border-radius: 20% 71% 47% 70% / 81% 15% 22% 54%;
			rotate: 41deg;
		}
		100% {
			translate: 0% -5%;
			border-radius: 100% 75% 92% 74% / 60% 80% 30% 70%;
			rotate: -120deg;
		}
	}

	@keyframes breathe {
		from {
			scale: var(--scale-min);
		}
		to {
			scale: var(--scale-max);
		}
	}

	@keyframes fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.5;
		}
	}
</style>
