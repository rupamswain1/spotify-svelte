<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import type { PageData } from '.$types';
	export let data: PageData;

	let sections: {
		title: string;
		path: string;
		items: (SpotifyApi.AlbumObjectSimplified | SpotifyApi.PlaylistObjectSimplified)[];
	}[] = [];

	$: {
		if (data.newReleases) {
			sections.push({
				title: 'New Releases',
				path: '/sections/new-releases',
				items: data.newReleases.albums.items
			});
		}
		if (data.featuredPlaylists) {
			sections.push({
				title: 'Featured Playlists',
				path: '/section/featured-playlists',
				items: data.featuredPlaylists.playlists.items
			});
		}
		data.homeCategories.forEach((category, index) => {
			const categoryPlaylists = data.categoriesPlaylists[index];
			if (categoryPlaylists) {
				sections.push({
					title: categoryPlaylists.message,
					path: `/category/$category.id`,
					items: categoryPlaylists.playlists.items
				});
			}
		});
		if (data.userPlaylists) {
			sections.push({
				title: 'Your Playlists',
				path: '/playlists',
				items: data.userPlaylists.items
			});
		}
	}
</script>

{#each sections as section}
	<section class="content-row">
		<div class="content-row-header">
			<div class="right">
				<h2 class="section-title">{section.title}</h2>
			</div>
			<div class="left">
				<Button element="a" href={section.path} variant="outline"
					>See All<span class="visually-hidden">{section.title}</span></Button
				>
			</div>
		</div>
		<div class="grid-items">
			{#each section.items as item}
				<div class="grid-item">
					<Card {item} />
				</div>
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	.content-row {
		margin-bottom: 40px;
		.content-row-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20px;
			.section-title {
				font-size: 1.5rem;
				font-weight: 600;
				margin: 0;
			}
		}
	}
</style>
