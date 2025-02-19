import { PersistentState } from './persistent-state.svelte';

export class AsyncState<T> {
	private store: PersistentState<AsyncStateData<T>>;
	private options: AsyncStateOptions<T>;

	constructor(key: string, options: AsyncStateOptions<T> = {}) {
		this.options = options;
		this.store = new PersistentState<AsyncStateData<T>>(key, {
			data: options.initialData,
			error: undefined,
			status: options.initialData ? 'success' : 'idle',
			timestamp: Date.now(),
		});
	}

	// Derived getters
	get data() {
		return this.store.value.data;
	}
	get error() {
		return this.store.value.error;
	}
	get status() {
		return this.store.value.status;
	}
	get timestamp() {
		return this.store.value.timestamp;
	}

	// Derived states
	isLoading = $derived(this.status === 'loading');
	isError = $derived(this.status === 'error');
	isSuccess = $derived(this.status === 'success');
	isStale = $derived(this.checkIfStale());

	private checkIfStale() {
		if (!this.timestamp) return true;
		if (!this.options.staleTime) return false;
		return Date.now() - this.timestamp > this.options.staleTime;
	}

	setData(data: T) {
		this.store.value = {
			...this.store.value,
			data,
			status: 'success',
			error: undefined,
			timestamp: Date.now(),
		};
	}

	setError(error: Error) {
		this.store.value = {
			...this.store.value,
			error,
			status: 'error',
			timestamp: Date.now(),
		};
	}

	setLoading() {
		this.store.value = {
			...this.store.value,
			status: 'loading',
		};
	}

	reset() {
		this.store.value = {
			data: undefined,
			error: undefined,
			status: 'idle',
			timestamp: Date.now(),
		};
	}
}

type AsyncStateData<T> = {
	data: T | undefined;
	error: Error | undefined;
	status: 'idle' | 'loading' | 'success' | 'error';
	timestamp: number;
};

type AsyncStateOptions<T> = {
	initialData?: T;
	staleTime?: number;
};
