<script lang="ts">
	import Button from './Button.svelte';
	import type { ActionData as AddActionData } from '../../routes/playlists/new/$types';
	import type { ActionData as EditActionData } from '../../routes/playlist/[id]/edit/$types';
	import { applyAction, enhance } from '$app/forms';

	export let form: AddActionData | EditActionData;
	export let userID: string | undefined = undefined;
	export let action: string | undefined = undefined;
	export let playlist:
		| SpotifyApi.PlaylistObjectFull
		| SpotifyApi.PlaylistObjectSimplified
		| undefined = undefined;

	let isLoading = false;
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		isLoading = true;
		return () => {
			isLoading = false;
			return async ({ result }) => {
				await applyAction(result);
				isLoading = false;
			};
		};
	}}
>
	{#if userID}<input hidden name="userID" value={userID} />{/if}
	<div class="field" class:has-error={form?.nameError}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			id="playlist-name"
			name="name"
			placeholder="Playlist Name"
			value={form?.name || playlist?.name || ''}
		/>
		{#if form?.nameError}
			<p class="error">{form?.nameError}</p>
		{/if}
	</div>
	<div class="field">
		<label for="playlist-name">Description</label>
		<input
			type="text"
			id="playlist-description"
			name="description"
			placeholder="Playlist Description"
			value={form?.description || playlist?.description || ''}
		/>
		{#if form?.nameError}
			<p class="error">{form?.nameError}</p>
		{/if}
	</div>

	<div class="submit-button">
		<Button element="button" type="submit" disabled={isLoading}
			>{playlist ? 'Save Playlist' : 'Create Playlist'}</Button
		>
	</div>
</form>

<style lang="scss">
	form {
		max-width: 400px;
		.field {
			margin-bottom: 20px;
			&.has-error input {
				outline: 2px solid var(--error);
			}
			label {
				display: inline-block;
				margin-bottom: 10px;
				font-size: 0.9rem;
			}
			input {
				width: 100%;
			}
		}
		p.error {
			color: var(--error);
			font-size: 0.9rem;
			margin: 10px 0 0;
		}
		.submit-button {
			text-align: right;
			margin-top: 40px;
		}
	}
</style>
