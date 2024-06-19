<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h2>Add a Playlist</h2>

<form method="POST">
	<input hidden name="userID" value={data.user?.id} />
	<div class="field" class:has-error={form?.nameError}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			id="playlist-name"
			name="name"
			placeholder="Playlist Name"
			value={form?.name || ''}
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
			value={form?.description || ''}
		/>
		{#if form?.nameError}
			<p class="error">{form?.nameError}</p>
		{/if}
	</div>

	<div class="submit-button">
		<Button element="button" type="submit">Create Playlist</Button>
	</div>
</form>
