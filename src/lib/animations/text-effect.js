export function textEffect(target, callback, speed = 35) {
	const letters = "j?abcdefgvwxyzvq/@_jdu,q&[5=i%5i?n}c;*3ty4rnc*hecxai(4c$?&9@g[";

	let interval = null;
	let iteration = 0;
	let text = "";

	clearInterval(interval);

	interval = setInterval(() => {
		text = target
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return target[index];
				}
				return letters[Math.floor(Math.random() * 26)];
			})
			.join("");

		callback(text);

		if (iteration >= target.length) {
			clearInterval(interval);
		}

		iteration += 1 / 2;
	}, speed);
}
