<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import TrackList from '$components/TrackList.svelte';
	import { Heart } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { toasts } from '$stores';
	import Modal from '$components/Modal.svelte';
	import PlaylistForm from '$components/PlaylistForm.svelte';
	import type { ActionData as EditActionData } from './edit/$type';
	import MicroModal from 'micromodal';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData | EditActionData;
	let followButton: Button<'button'>;
	let isLoading = false;
	$: color = data.color;
	$: playlist = data.playlist;
	$: tracks = data.playlist.tracks;
	$: isFollowing = data.isFollowing;
	$: currentPage = $page.url.searchParams.get('page') || 1;
	let filteredTracks: SpotifyApi.TrackObjectFull[];

	$: {
		filteredTracks = [];
		tracks.items.forEach((item) => {
			if (item.track) filteredTracks = [...filteredTracks, item.track];
		});
	}

	const followersFormat = Intl.NumberFormat('en', { notation: 'compact' });
	const loadMoreTracks = async () => {
		if (!tracks.next) return;
		isLoading = true;
		const res = await fetch(tracks.next.replace('https://api.spotify.com/v1/', '/api/spotify/'));
		const resJSON = await res.json();
		if (res.ok) {
			tracks = { ...resJSON, items: [...tracks.items, ...resJSON.items] };
		} else {
			toasts.error(resJSON.error.message || 'Could not load data!');
		}
		isLoading = false;
	};
</script>

<ItemPage
	title={playlist.name}
	image={playlist?.images?.length > 0 ? playlist?.images[0]?.url : undefined}
	{color}
	type={playlist.type}
>
	<div slot="meta">
		<p class="playlist-description">{@html playlist.description}</p>
		<p class="meta">
			<span>{playlist.owner.display_name}</span>
			<span>{followersFormat.format(playlist.followers.total)} Followers</span>
			<span>{playlist.tracks.total} Tracks</span>
		</p>
	</div>

	<div class="playlist-actions">
		{#if data.user?.id === playlist.owner.id}
			<Button
				element="a"
				variant="outline"
				href="/playlist/{playlist.id}/edit"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('edit-playlist-modal');
				}}>Edit Playlist</Button
			>
		{:else if isFollowing != null}
			<form
				class="follow-form"
				method="POST"
				action={`?/${isFollowing ? 'unFollowPlaylist' : 'followPlaylist'}`}
				use:enhance={() => {
					isLoadingFollow = true;
					return async ({ result }) => {
						isLoadingFollow = false;
						if (result.type === 'success') {
							isFollowing = !isFollowing;
							await applyAction(result);
						} else if (result.type === 'failure') {
							toasts.error(result.data?.followError);
						} else {
							await applyAction(result);
						}
						followButton.focus();
						invalidateAll();
					};
				}}
			>
				<Button bind:this={followButton} element="button" type="submit" variant="outline">
					<Heart aria-hidden focusable="false" fill={isFollowing ? 'var(--text-color)' : 'none'} />
					{isFollowing ? 'Unfollow' : 'Follow'}
					<span class="visually-hidden">{playlist.name} playlist</span>
				</Button>
				{#if form && 'followForm' in form && form?.followError}
					<p class="error">{form.followError}</p>
				{/if}
			</form>
		{/if}
	</div>

	{#if playlist.tracks.items.length > 0}
		<TrackList
			tracks={filteredTracks}
			isOwner={data.user?.id === playlist.owner.id}
			userPlaylists={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)}
		/>
		{#if playlist.tracks.next}
			<div class="load-more">
				<Button element="button" variant="outline" disabled={isLoading} on:click={loadMoreTracks}
					>Load More <span class="visually-hidden">Tracks</span></Button
				>
			</div>
		{/if}
		<div class="pagination">
			<div class="previous">
				{#if tracks.previous}
					<Button
						variant="outline"
						element="a"
						href="{$page.url.pathname}?{new URLSearchParams({
							page: `${Number(currentPage) - 1}`
						}).toString()}">&larr; Previous Page</Button
					>
				{/if}
			</div>
			<div class="next">
				{#if tracks.next}
					<Button
						variant="outline"
						element="a"
						href="{$page.url.pathname}?{new URLSearchParams({
							page: `${Number(currentPage) + 1}`
						}).toString()}">Next Page &rarr;</Button
					>
				{/if}
			</div>
		</div>
	{:else}
		<div class="empty-playlist">
			<p>No items added to this playlist yet.</p>
			<Button element="a" href="/search">Search for Content</Button>
			<Button element="a" href="/playlists">View all Playlists</Button>
		</div>
	{/if}
</ItemPage>
<Modal id="edit-playlist-modal" title="Edit {playlist.name}">
	<PlaylistForm
		action="/playlists/{playlist.id}/edit"
		form={form && 'editForm' in form ? form : null}
	/>
</Modal>

<style lang="scss">
	.empty-playlist {
		text-align: center;
		margin-top: 40px;
		p {
			font-size: 1.5rem;
			font-weight: 600;
		}
		:global(a) {
			margin: 0 10px;
		}
	}
	.playlist-description {
		color: var(--light-gray);
		font-size: 1.2rem;
		margin-bottom: 0;
	}
	.meta {
		font-size: 0.8rem;
		margin-top: 10px;
		span {
			margin-right: 5px;
			&:first-child {
				font-weight: 600;
			}
		}
	}
	.load-more {
		padding: 15px;
		text-align: center;
	}
	.pagination {
		display: none;
		margin-top: 40px;
		justify-content: space-around;
		:global(html.no-js) {
			display: flex;
		}
	}
	.playlist-actions {
		display: flex;
		justify-content: flex-end;
		margin: 10px 0 30px;
		.follow-form {
			:global(.button) {
				display: flex;
				align-items: center;
				:global(svg) {
					margin-right: 10px;
					width: 22px;
					height: 22px;
				}
			}
			p.error {
				text-align: right;
				color: var(--error);
				font-size: 0.9rem;
			}
		}
	}
</style>
