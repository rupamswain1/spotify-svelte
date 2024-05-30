<script lang="ts">
	import { msToTime } from '$helpers';
	import { Clock8, ListPlus } from 'lucide-svelte';
	import Player from './Player.svelte';
	import playingGif from '$assets/playing.gif';

	let currentPlaying: string | null = null;
	let isPaused: boolean = false;

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
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
		<div class="actions-column"></div>
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
			<div class="actions-column">
				<ListPlus />
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
		.action-column {
			width: 30px;
			margin-left: 15px;
		}
	}
</style>