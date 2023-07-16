<section>
	<h2>Projects:</h2>
	<ul>
		<li><a href="./projects/plugin-surf">Plugin Surf</a></li>
		<li><a href="./projects/spell">Spell Web</a></li>
		<li><a href="./projects/game-hub">Game Hub</a></li>
		<li><a href="./projects/okolors">OKolors</a></li>
		<li><a href="./projects/tom-wobbe">Tom Wobbe</a></li>
		<li><a href="./projects/ai-web">AI // WEB</a></li>
		<!-- <li><a href="./projects/rainy-days">Rainy Days</a></li> -->
		<li><a href="./projects/artic-exploration">ARTic Exploration</a></li>
		<li><a href="./projects/rename">R.E.N.A.M.E</a></li>
		<li><a href="./projects/futeum">Futeum</a></li>
		<li><a href="./projects/square-eyes">Square Eyes</a></li>
	</ul>
</section>

<style lang="postcss">
	li {
		transition: all calc(var(--transition-time) / 4) ease-in-out;
	}

	li:has(a:hover) {
		transform: translate(0.5rem, 0);
		font-variation-settings: var(--font-hover-settings);
	}

	li:has(a:hover)::marker {
		content: "> ";
	}
</style>
