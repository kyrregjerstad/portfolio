<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	import { cn } from '@/lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Moon, Sun } from '@lucide/svelte';

	type Props = {
		darkMode: boolean;
		class?: string;
	};

	const { darkMode, class: className }: Props = $props();

	const submitAction: SubmitFunction = ({ formData }) => {
		const mode = formData.get('dark-mode');

		if (mode === 'dark') {
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
	<Button variant="ghost" size="icon" type="submit" name="dark-mode" id="dark-mode" value={darkMode ? 'light' : 'dark'}>
		<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</form>
