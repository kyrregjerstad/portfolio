<script lang="ts">
	import Button from '@/components/Button.svelte';
	import Slider from '@/components/Slider.svelte';
	import type { ParticleLocalStore, ParticleSettings } from '@/lib/stores/particleStore.svelte';

	const movementPatterns = ['rain', 'spiral', 'drift', 'waves', 'converge'];

	type Props = {
		settings: ParticleLocalStore<ParticleSettings>;
		onUpdate: (fullReinitialize?: boolean) => void;
		showControls: boolean;
	};

	let { settings, onUpdate, showControls = $bindable(true) }: Props = $props();

	if (!settings.value.colorOverlay) {
		settings.value.colorOverlay = {
			enabled: false,
			color: '#ffffff',
			intensity: 0.5,
		};
	}

	function handleUpdate(requiresReinitialize: boolean = false) {
		onUpdate(requiresReinitialize);
	}
</script>

{#if showControls}
	<div class="fadeIn w-full max-w-(--breakpoint-md) space-y-4 rounded-lg bg-black/20 p-4 text-white backdrop-blur-xs">
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-2">
				<label class="block">
					Movement Pattern
					<select
						class="w-full rounded bg-white/10 px-2 py-1"
						bind:value={settings.value.movementPattern}
						onchange={() => handleUpdate(true)}
					>
						{#each movementPatterns as pattern}
							<option value={pattern}>{pattern}</option>
						{/each}
					</select>
				</label>

				<label class="block">
					Number of Particles
					<!-- Setting this too high will cause performance issues -->
					<Slider
						min={500}
						max={30_000}
						bind:value={settings.value.numberOfParticles}
						onchange={() => handleUpdate(true)}
					/>

					<span class="text-sm">{settings.value.numberOfParticles}</span>
				</label>

				<label class="block">
					Trail Intensity
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						bind:value={settings.value.trailIntensity}
						onchange={() => handleUpdate(false)}
						class="w-full"
					/>
					<span class="text-sm">{settings.value.trailIntensity}</span>
				</label>

				<label class="block">
					Speed Multiplier
					<input
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						bind:value={settings.value.speedMultiplier}
						onchange={() => handleUpdate(false)}
						class="w-full"
					/>
					<span class="text-sm">{settings.value.speedMultiplier}</span>
				</label>
			</div>

			<div class="space-y-2">
				<label class="block">
					Turbulence
					<input
						type="range"
						min="0"
						max="5"
						step="0.1"
						bind:value={settings.value.turbulence}
						onchange={() => handleUpdate(false)}
						class="w-full"
					/>
					<span class="text-sm">{settings.value.turbulence}</span>
				</label>

				<label for="is-static">Static</label>
				<input
					id="is-static"
					type="checkbox"
					bind:checked={settings.value.staticMode}
					onchange={() => handleUpdate(false)}
				/>

				<label for="cursor-interaction">Cursor Interaction</label>
				<input
					id="cursor-interaction"
					type="checkbox"
					bind:checked={settings.value.cursorInteraction}
					onchange={() => handleUpdate(false)}
				/>

				<label class="block">
					Cursor Radius
					<input
						type="range"
						min="50"
						max="500"
						step="25"
						bind:value={settings.value.cursorRadius}
						onchange={() => handleUpdate(false)}
						disabled={!settings.value.cursorInteraction}
						class="w-full"
					/>
					<span class="text-sm">{settings.value.cursorRadius}px</span>
				</label>

				<div class="control-group">
					<label for="cursorForce">
						Cursor Force
						<span class="text-sm opacity-75"> (Positive repels, Negative attracts) </span>
					</label>
					<input
						disabled={!settings.value.cursorInteraction}
						type="range"
						id="cursorForce"
						min="-1"
						max="1"
						step="0.1"
						bind:value={settings.value.cursorForce}
						oninput={() => handleUpdate(false)}
					/>
					<span class="value">{settings.value.cursorForce}</span>
				</div>

				<label class="block">
					Angle
					<input
						type="range"
						min="0"
						max="360"
						step="1"
						bind:value={settings.value.angle}
						onchange={() => handleUpdate(true)}
						class="h-8 w-full bg-transparent"
					/>
					<span class="text-sm">{settings.value.angle}°</span>
				</label>
			</div>
		</div>

		<div class="space-y-2">
			<h3>Particle Appearance</h3>

			<label>
				Particle Shape
				<select bind:value={settings.value.particleShape} onchange={() => handleUpdate()} class="text-black">
					<option value="circle">Circle</option>
					<option value="square">Square</option>
					<option value="triangle">Triangle</option>
				</select>
			</label>

			<label>
				Min Size
				<input
					type="range"
					min="0.1"
					max="5"
					step="0.1"
					bind:value={settings.value.particleSize.min}
					onchange={() => handleUpdate(true)}
				/>
				<span>{settings.value.particleSize.min}</span>
			</label>

			<label>
				Max Size
				<input
					type="range"
					min="0.1"
					max="15"
					step="0.1"
					bind:value={settings.value.particleSize.max}
					onchange={() => handleUpdate(true)}
				/>
				<span>{settings.value.particleSize.max}</span>
			</label>
		</div>

		<div class="controls-section">
			<h3>Color Overlay</h3>

			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={settings.value.colorOverlay.enabled}
					onchange={() => handleUpdate(false)}
				/>
				Enable Color Overlay
			</label>

			{#if settings.value.colorOverlay.enabled}
				<div class="space-y-2">
					<label class="block">
						Overlay Color
						<input
							type="color"
							bind:value={settings.value.colorOverlay.color}
							onchange={() => handleUpdate(false)}
							class="block w-full"
						/>
					</label>

					<label class="block">
						Overlay Intensity
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							bind:value={settings.value.colorOverlay.intensity}
							onchange={() => handleUpdate(false)}
							class="w-full"
						/>
						<span class="text-sm">{settings.value.colorOverlay.intensity}</span>
					</label>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.fadeIn {
		opacity: 1;
		transition: opacity 1s 1s ease-in-out;
	}

	@starting-style {
		.fadeIn {
			opacity: 0;
		}
	}
</style>
