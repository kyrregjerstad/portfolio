<section>
	<h2>Projects:</h2>
	<ul>
		<li><a href="./Projects/plugin-surf">Plugin Surf</a></li>
		<li><a href="./Projects/spell">Spell Web</a></li>
		<li><a href="./Projects/game-hub">Game Hub</a></li>
		<li><a href="./Projects/okolors">OKolors</a></li>
		<li><a href="./Projects/tom-wobbe">Tom Wobbe</a></li>
		<li><a href="./Projects/ai-web">AI // WEB</a></li>
		<!-- <li><a href="./Projects/rainy-days">Rainy Days</a></li> -->
		<li><a href="./Projects/artic-exploration">ARTic Exploration</a></li>
		<li><a href="./Projects/rename">R.E.N.A.M.E</a></li>
		<li><a href="./Projects/futeum">Futeum</a></li>
		<li><a href="./Projects/square-eyes">Square Eyes</a></li>
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
