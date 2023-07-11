<section>
	<h2>Projects:</h2>
	<ul>
		<li><a href="./Projects/Spell">Spell Web</a></li>
		<li><a href="./Projects/okolors">OKolors</a></li>
		<li><a href="./Projects/ai-web">AI // WEB</a></li>
		<!-- <li><a href="./Projects/Rainy_Days">Rainy Days</a></li> -->
		<li><a href="./Projects/ARTic_Exploration">ARTic Exploration</a></li>
		<li><a href="./Projects/RENAME">R.E.N.A.M.E</a></li>
		<li><a href="./Projects/Futeum">Futeum</a></li>
		<li><a href="./Projects/Square_Eyes">Square Eyes</a></li>
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
