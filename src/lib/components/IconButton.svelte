<script lang="ts">
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	export let icon: ComponentType<Icon>;
	export let label: string;
	interface $$Props extends HTMLButtonAttributes {
		icon: ComponentType<Icon>;
		label: string;
	}

	let button: HTMLButtonElement;

	export function getButton() {
		return button;
	}
</script>

<button bind:this={button} on:click on:mouseover on:focus on:keydown {...$$restProps}>
	<svelte:component this={icon} color="var(--text-color)" aria-hidden="true" focusable="false" />
	<span class="visually-hidden">{label}<span /> </span></button
>

<style lang="scss">
	button {
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
		width: 38px;
		height: 38px;
		:global(svg) {
			vertical-align: middle;
		}
		&.disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
		&:active {
			background-color: var(--menu-background-color);
		}
	}
	.visually-hidden {
		clip: react(0, 0, 0);
		clip-path: inset(100Y);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
</style>
