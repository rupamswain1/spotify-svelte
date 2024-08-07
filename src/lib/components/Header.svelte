<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';
	import { tippy } from '$actions';
	import { LogoutButton, Navigation, SearchForm } from '$components';
	export let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		{#if browser}
			<Navigation desktop={false} {userAllPlaylists} />
		{/if}
		{#if $page.url.pathname.startsWith('/search')}
			<div class="search-form">
				<SearchForm />
			</div>
		{/if}
	</div>
	<div class="right">
		<div id="profile-button">
			<button
				class="profile-button"
				use:tippy={{
					content: document.getElementById('profile-menu') || undefined,
					onMount: () => {
						const template = document.getElementById('profile-menu');
						if (template) {
							template.style.display = 'block';
						}
					},
					trigger: 'click',
					placement: 'bottom-end',
					interactive: true,
					theme: 'menu'
				}}
			>
				{#if user?.images && user.images.length > 0}
					<img src={user.images[0].url} alt="" />
				{/if}
				{user?.display_name}<span class="visually-hidden">Profile menu</span>
				<ChevronDown class="profile-arrow" size={22} />
			</button>
			<div id="profile-menu" style="display:none">
				<div class="profile-menu-content">
					<ul>
						<li>
							<a
								href={user?.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								style="display: flex; align-items: center"
							>
								View on Spotify
								<ExternalLink focusable="false" aria-hidden />
							</a>
						</li>
						<li>
							<a href="/profile">View Profile</a>
						</li>
						<li><LogoutButton /></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.search-form {
		display: none;
		@media only screen and (max-width: 1024px) {
			display: block;
		}
	}
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		z-index: 200;
		:global(html.no-js) & {
			@media only screen and (max-width: 1000px) {
				justify-content: flex-start;
			}
		}
	}
	.profile-button {
		background: none;
		border: 1px solid var(--border);
		padding: 5px;
		border-radius: 25px;
		display: flex;
		align-items: center;
		color: var(--text-color);
		cursor: pointer;
		:global(html.no-js) & {
			display: none;
		}
		:global(.profile-arrow) {
			margin-left: 3px;
		}
		img {
			width: 28px;
			height: 28px;
			border-radius: 100%;
			margin-right: 10px;
		}
		&:hover {
			background-color: var(--accent-color);
		}
	}
	.profile-menu-content {
		padding: 5px 0;
		ul {
			padding: 0;
			margin: 0;
			list-style: none;
			li {
				&:hover {
					background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
				}
				a :global(svg) {
					vertical-align: middle;
					margin-left: 10px;
				}
				a,
				:global(button) {
					display: inline-block;
					padding: 10px 15px;
					background: none;
					border: none;
					text-decoration: none;
					cursor: pointer;
					color: var(--menu-text-color);
					width: 100%;
					text-align: left;
					font-size: 0.9rem;
					border-radius: 0;
					&:hover {
						background-image: none;
					}
				}
			}
		}
	}
	:global(html.no-js) #profile-menu {
		display: block !important;
		.profile-menu-content {
			ul {
				padding: 0;
				margin: 0;
				li {
					display: inline-block;
				}
			}
		}
	}
</style>
