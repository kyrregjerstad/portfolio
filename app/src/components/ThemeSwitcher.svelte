<script lang="ts">
	import { enhance } from '$app/forms';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { cn } from '@/lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';

	type Props = {
		darkMode: boolean;
		class?: string;
	};

	const { darkMode, class: className }: Props = $props();

	const submitAction: SubmitFunction = ({ formData }) => {
		if (!!formData.get('dark-mode')) {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	};
</script>

<form
	method="post"
	use:enhance={submitAction}
	action="/?/setTheme"
	class={cn('flex items-center space-x-2', className)}
>
	<Label for="dark-mode" class="text-xs">Dark Mode</Label>
	<Switch id="dark-mode" name="dark-mode" type="submit" checked={darkMode} />
</form>
