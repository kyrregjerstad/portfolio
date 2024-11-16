<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Sign in</h1>
<a href="/login/github">Sign in with GitHub</a>
