<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import Pagination from '$components/pagination.svelte';
	import toast from '$stores/toast';
	import type { PageData } from '../$types';

	export let data: PageData;
	let isLoading = false;

	$: playlists = data.userPlayLists;

	async function loadMore() {
		if (!playlists.next) return;
		isLoading = true;
		const res = await fetch(
			playlists?.next.replace('https://api.spotify.com/v1/', '/api/spotify/')
		);

		if (res.ok) {
			const resJSON = await res.json();
			playlists = {
				...resJSON,
				items: [...playlists?.items, ...resJSON.items]
			};
		} else {
			toast.error('Could not load data!');
		}
		isLoading = false;
	}
</script>

<div class="content">
	{#if playlists?.items?.length > 0}
		<div class="title">
			<h1>{data.title}</h1>
			<Button element="a" href="/playlists/new">Add New</Button>
		</div>
		<div class="grid-item">
			{#each playlists.items as item}
				<Card {item} />
			{/each}
		</div>
		<Pagination paginatedList={playlists} on:loadmore={loadMore} {isLoading} />
	{:else}
		<div class="empty">
			<p>No Playlists yet</p>
			<Button element="a" href="/playlists/new">Add New</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.content {
		padding-bottom: 60px;
		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.grid-items {
			margin-bottom: 40px;
		}
		.empty {
			text-align: center;
			margin-top: 40px;
			p {
				font-size: 1.5rem;
				font-weight: 600;
			}
		}
	}
</style>
