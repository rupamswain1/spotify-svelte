<script lang="ts">
	import { msToTime } from '$helpers';
	import { Clock8, ListPlus, ListX } from 'lucide-svelte';
	import Player from './Player.svelte';
	import playingGif from '$assets/playing.gif';
	import tippy from '$actions/tippy/tippy-plugin';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	let currentPlaying: string | null = null;
	let isPaused: boolean = false;
	let isRemoveingFromPlaylist: string[] = [];

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
	export let isOwner: boolean = false;
	export let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;
</script>

<div class="tracks">
	<div class="row header">
		<div class="number-column">
			<span class="number">#</span>
		</div>
		<div class="info-column">
			<div class="track-title">Title</div>
		</div>
		<div class="duration-column">
			<Clock8 aria-hidden focusable="false" />
		</div>
		<div class="actions-column" class:is-owner={isOwner}></div>
	</div>
	{#each tracks as track, index}
		<div class="row" class:is-current={currentPlaying === track.id}>
			<div class="number-column">
				{#if currentPlaying === track.id && !isPaused}
					<img class="playing-gif" src={playingGif} alt="" />
				{:else}
					<span class="number">{index + 1}</span>
				{/if}

				<div class="player">
					<Player
						{track}
						on:play={(e) => {
							currentPlaying = e.detail.track.id;
							isPaused = false;
						}}
						on:pause={(e) => {
							isPaused = e.detail.track.id === currentPlaying;
						}}
					/>
				</div>
			</div>
			<div class="info-column">
				<div class="track-title">
					<h4>{track.name}</h4>
					{#if track.explicit}
						<span class="explicit">Explicit</span>
					{/if}
				</div>
				<p class="artis">
					{#each track.artists as artist, artistIndex}
						<a href="/artist/{artist.id}">{artist.name}</a
						>{#if artistIndex < track.artists.length - 1}{','}{/if}
					{/each}
				</p>
			</div>
			<div class="duration-column">
				<span class="duration">{msToTime(track.duration_ms)}</span>
			</div>
			<div class="actions-column" class:is-owner={isOwner}>
				{#if isOwner}
					<form
						method="POST"
						action="/playlist/{$page.params.id}?/removeItem"
						use:enhance={({ cancel }) => {
							if (isRemoveingFromPlaylist.includes(track.id)) {
								cancel();
							}
							isRemovingFromPlaylist = [...isRemovingFromPlaylist, track.id];
							return ({ result }) => {
								if (result.type === 'error') {
									toasts.error(result.error.message);
								}
								if (result.type === 'redirect') {
									const url = new URL(`${$page.url.origin}${result.location}`);
									const error = url.searchParams.get('error');
									const success = url.searchParams.get('success');
									if (error) {
										toasts.error(error);
									}
									if (success) {
										toasts.success(success);
										invalidate(`/api/spotify/playlists/${$page.params.id}`);
									}
								}
								isRemovingFromPlaylist = isRemovingFromPlaylist.filter((t) => t !== track.id);
							};
						}}
					>
						<input hidden name="track" value={track.id} />
						<button
							type="submit"
							title="Remove {track.name} from playlist"
							class="remove-pl-button"
							disabled={isRemoveingFromPlaylist.includes(track.id)}
						>
							<ListX aria-hidden focusable="false" />
						</button>
					</form>
				{:else}
					<button
						title="Add {track.name} to a playlist"
						aria-label="Add {track.name} to a playlist"
						class="add-pl-button"
						disabled={!userPlaylists}
						on:click={() => console.log('click')}
						use:tippy={{
							content: document.getElementById(`${track.id}-playlists-menu`) || undefined,
							allowHTML: true,
							trigger: 'click',
							interactive: true,
							theme: 'menu',
							placement: 'bottom-end',
							onMount: () => {
								const template = document.getElementById(`${track.id}-playlists-menu`);
								if (template) {
									template.style.display = 'block';
								}
							}
						}}
					>
						<ListPlus aria-hidden focusable="false" />
					</button>
					{#if userPlaylists}
						<div class="playlists-menu" id="{track.id}-playlists-menu" style="display: none;">
							<div class="playlists-menu-content">
								<form method="POST" action="/playlist?/addItem&redirect={$page.url.pathname}">
									<input hidden value={track.id} name="track" />
									<div class="field">
										<select aria-label="Playlist" name="playlist">
											{#each userPlaylists as playlist}
												<option value={playlist.id}>{playlist.name}</option>
											{/each}
										</select>
									</div>
									<div class="submit-button">
										<Button element="button" type="submit">
											Add <span class="visually-hidden"> {track.name} to selected playlist.</span>
										</Button>
									</div>
								</form>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	{/each}
	<!-- <ul>
		{#each tracks as track}
			<li>{track.name}</li>
		{/each}
	</ul> -->
</div>

<style lang="scss">
	.tracks {
		.row {
			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;
			@media only screen and (max-width: 750px) {
				:global(.no-js) & {
					flex-direction: column;
					background-color: rgba(255, 255, 255, 0.03);
					padding: 20px;
					margin-bottom: 20px;
				}
			}
			&.is-current {
				.info-column .track-title h4,
				.number-column span.number {
					color: var(--accent-color);
				}
			}
			&.header {
				border-bottom: 1px solid var(--border);
				border-radius: 0px;
				padding: 5px;
				margin-bottom: 15px;
				@media only screen and (max-width: 750px) {
					:global(.no-js) & {
						display: none;
					}
				}
			}
			border-radius: 0px;
			padding: 5px;
			margin-bottom: 15px;
			.track-title {
				color: var(--light-gray);
				font-size: 2rem;
				text-transform: uppercase;
			}
			.duration-column :global(svg) {
				width: 16px;
				height: 16px;
			}
			&:not(.header) {
				&:hover {
					background-color: rgba(255, 255, 255, 0.05);
					.number-column {
						.player {
							display: block;
						}
						span.number {
							display: none;

							:global(.no-js) & {
								display: block;
							}
						}

						.playing-gif {
							display: none;
						}
					}
				}
			}
		}

		.number-column {
			width: 30px;
			display: flex;
			justify-content: flex-end;
			margin-right: 15px;
			span.number {
				color: var(--light-gray);
				font-size: 0.9rem;
			}
			.playing-gif {
				width: 12px;
			}
			.player {
				display: none;
			}
			:global(html.no-js) & {
				width: 200px;
				display: flex;
				align-items: center;
				@media only screen and (max-width: 750px) {
					width: 100%;
					margin-right: 0;
					margin-bottom: 15px;
				}
				.player {
					display: block;
					width: 100px;
					margin-left: 10px;
				}
			}
		}
		.info-column {
			flex: 1;
			@media only screen and (max-width: 750px) {
				:global(.no-js) & {
					width: 100%;
				}
			}
			.track-title {
				display: flex;
				align-items: center;
				h4 {
					margin: 0;
					font-size: 0.95rem;
					font-weight: 400;
					line-height: 1;
				}
				span.explicit {
					text-transform: uppercase;
					font-size: 0.5rem;
					margin-left: 10px;
					border: 1px solid;
					padding: 2px 3px;
					border-radius: 2px;
					line-height: 0.8rem;
					color: var(--light-gray);
				}
			}
			.artists {
				color: var(--light-gray);
				font-size: 0.9rem;
				margin: 7px 0 0;
				line-height: 1;
				a {
					color: inherit;
					text-decoration: none;
				}
			}
		}
		.duration-column {
			span.duration {
				color: var(--light-gray);
				font-size: 0.8rem;
			}
			@media only screen and (max-width: 750px) {
				:global(.no-js) & {
					width: 100%;
					margin: 10px 0;
				}
			}
		}
		.actions-column {
			width: 30px;
			margin-left: 15px;
			.add-pl-button .remove-pl-button {
				background: none;
				border: none;
				padding: 5px;
				cursor: pointer;
				:global(svg) {
					stroke: var(--text-color);
					vertical-align: middle;
					width: 22px;
					height: 22px;
				}
				&:disabled {
					opacity: 0.8;
					cursor: not-allowed;
				}
			}
			.playlists-menu-content {
				padding: 15 px;
				.field {
					select {
						width: 100px;
						height: 35px;
						border-radius: 4px;
					}
				}
				.submit-button {
					margin-top: 10px;
					text-align: right;
				}
			}
		}
	}
</style>
