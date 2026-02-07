<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		children,
		...restProps
	}: SelectPrimitive.GroupHeadingProps = $props();
</script>

<SelectPrimitive.GroupHeading
	class={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
	{...restProps}
>
	{@render children?.()}
</SelectPrimitive.GroupHeading>
