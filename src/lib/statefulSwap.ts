import { writable } from "svelte/store";

export default function statefulSwap(initialState: string | null) {
	const state = writable(initialState);
	let nextState = initialState;

	function transitionTo(newState: string) {
		if (nextState === newState) return;
		nextState = newState;
		state.set(null);
	}

	function onOutro() {
		state.set(nextState);
	}
	return {
		state,
		transitionTo,
		onOutro
	};
}
