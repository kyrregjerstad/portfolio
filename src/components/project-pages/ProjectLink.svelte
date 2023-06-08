<script>
	export let title = "";
	export let url = "";
</script>

<ul>
	<li>
		<a href={url} target="_blank" rel="noreferrer">{title}</a>
	</li>
</ul>

<style>
	li {
		font-size: 3rem;
		list-style: none;
	}

	a:hover {
		font-weight: 800;
	}

	li {
		transition: transform calc(var(--transition-time) / 4) ease-in-out;
	}

	li:has(a):hover {
		transform: translate(0.5rem, 0);
	}

	li:hover::marker {
		content: ">";
	}
</style>
