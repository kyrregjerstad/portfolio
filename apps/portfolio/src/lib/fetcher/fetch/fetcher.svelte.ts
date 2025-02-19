import { browser } from '$app/environment';
import { AsyncState } from '../core/async-state.svelte';
import type { FetcherOptions, FetchConfig, MutateConfig } from './types';

export class Fetcher<T, TError = Error> extends AsyncState<T> {
	private readonly fetcherOptions: FetcherOptions<T, TError>;
	private controller = $state<AbortController | undefined>(undefined);
	private url: string;

	constructor(url: string, options: FetcherOptions<T, TError> = {}) {
		// Use URL as storage key if persistence is enabled
		const key = options.persist ? `svetch:${url}` : undefined;
		super(key ?? '', {
			initialData: options.initialData,
			staleTime: options.staleTime,
		});

		this.url = url;
		this.fetcherOptions = options;
		this.init();
	}

	private init() {
		if (this.fetcherOptions.immediate !== false) {
			// Only fetch if data is stale or doesn't exist
			if (this.isStale || !this.data) {
				this.fetch();
			}
		}

		// Setup auto-revalidation
		if (browser && this.fetcherOptions.revalidateOnFocus) {
			this.setupFocusRevalidation();
		}

		if (browser && this.fetcherOptions.revalidateOnReconnect) {
			this.setupReconnectRevalidation();
		}
	}

	private setupFocusRevalidation() {
		const onFocus = () => {
			if (this.isStale) {
				this.fetch();
			}
		};

		window.addEventListener('focus', onFocus, { passive: true });

		$effect.root(() => {
			return () => {
				window.removeEventListener('focus', onFocus);
			};
		});
	}

	private setupReconnectRevalidation() {
		const onReconnect = () => {
			if (this.isStale) {
				this.fetch();
			}
		};

		window.addEventListener('online', onReconnect, { passive: true });

		$effect.root(() => {
			return () => {
				window.removeEventListener('online', onReconnect);
			};
		});
	}

	async fetch(config: FetchConfig = {}) {
		// Don't fetch on server unless explicitly enabled
		if (!browser && !this.fetcherOptions.ssr) {
			return;
		}

		// Cancel previous request if it exists
		this.controller?.abort();
		this.controller = new AbortController();

		// Don't show loading state if we have data (background revalidation)
		if (!this.data || config.showLoading) {
			this.setLoading();
		}

		try {
			const response = await fetch(this.url, {
				signal: this.controller.signal,
				...this.fetcherOptions.fetchOptions,
				...config.fetchOptions,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const transformed = this.fetcherOptions.transform?.(data) ?? data;

			this.setData(transformed);

			// Call onSuccess callback if provided
			this.fetcherOptions.onSuccess?.(transformed);

			return transformed;
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				// Ignore abort errors
				return;
			}

			const errorTransformed = this.fetcherOptions.transformError?.(error) ?? (error as TError);
			this.setError(errorTransformed as Error);

			// Call onError callback if provided
			this.fetcherOptions.onError?.(errorTransformed);

			if (this.fetcherOptions.throwOnError) {
				throw errorTransformed;
			}
		}
	}

	async mutate<TData extends Partial<T>>(data: TData, config: MutateConfig<TData, T, TError> = {}) {
		const previousData = this.data;

		// Optimistic update
		if (config.optimistic && previousData !== undefined) {
			const optimisticData = config.optimisticUpdate?.(data, previousData) ?? { ...previousData, ...data };
			this.setData(optimisticData);
		}

		try {
			const response = await fetch(this.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
				...config.fetchOptions,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = await response.json();
			const transformed = this.fetcherOptions.transform?.(responseData) ?? responseData;

			this.setData(transformed);
			config.onSuccess?.(transformed);

			return transformed;
		} catch (error: unknown) {
			// Rollback optimistic update
			if (config.optimistic && previousData !== undefined) {
				this.setData(previousData);
			}

			const errorTransformed = this.fetcherOptions.transformError?.(error) ?? (error as TError);
			this.setError(errorTransformed as Error);

			config.onError?.(errorTransformed);

			if (this.fetcherOptions.throwOnError) {
				throw errorTransformed;
			}
		}
	}

	refresh() {
		return this.fetch({ showLoading: true });
	}

	abort() {
		this.controller?.abort();
	}
}

// Helper function for creating fetchers
export function createFetcher<T, TError = Error>(url: string, options?: FetcherOptions<T, TError>) {
	return new Fetcher<T, TError>(url, options);
}
