export function textEffect(target: string, callback: (text: string) => void, speed = 35) {
	/* spell-checker: disable */
	const letters = "j?abcdefgvwxyzvq/@_jdu,q&[5=i%5i?n}c;*3ty4rnc*hecxai(4c$?&9@g[";

	let interval: number | null = null;
	let iteration = 0;
	let text = "";

	if (interval) {
		clearInterval(interval);
	}

	interval = window.setInterval(() => {
		text = target
			.split("")
			.map((_, index) => {
				if (index < iteration) {
					return target[index];
				}
				return letters[Math.floor(Math.random() * 26)];
			})
			.join("");

		callback(text);

		if (iteration >= target.length && interval) {
			clearInterval(interval);
		}

		iteration += 1 / 2;
	}, speed);
}
