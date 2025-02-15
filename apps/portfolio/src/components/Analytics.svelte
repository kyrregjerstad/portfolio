<script>
	import { PUBLIC_PLAUSIBLE_SCRIPT_URL, PUBLIC_POSTHOG_API_KEY } from '$env/static/public';

	import { browser } from '$app/environment';
	import posthog from 'posthog-js';

	$effect(() => {
		if (browser) {
			posthog.init(PUBLIC_POSTHOG_API_KEY, {
				api_host: 'https://eu.i.posthog.com',
				person_profiles: 'always',
			});
		}
	});
</script>

<svelte:head>
	<script defer data-domain="kyrre.dev" src={PUBLIC_PLAUSIBLE_SCRIPT_URL}></script>
</svelte:head>
