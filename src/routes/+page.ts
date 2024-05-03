import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { user } = await parent();
	const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');

	const featuredPlayLists = fetch('/api/spotify/browse/featured-playlists?limit=6');
	const userPlayLists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);

	const catRes = await fetch(`api/spotify/browse/categories`);
	const catsResJSON: SpotifyApi.MultipleCategoriesResponse = catRes.ok
		? await catRes.json()
		: undefined;

	const randomCats = catsResJSON
		? catsResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];
	console.log({ randomCats });
	const randomCatsPromises = randomCats.map((cat) =>
		fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`)
	);
	const [newReleasesRes, featuredPlayListsRes, userPlayListsRes, ...randomCatsRes] =
		await Promise.all([newReleases, featuredPlayLists, userPlayLists, ...randomCatsPromises]);

	return {
		newReleases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		featuredPlaylists: featuredPlayListsRes.ok
			? (featuredPlayListsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		userPlayLists: userPlayListsRes.ok
			? (userPlayListsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		homeCategories: randomCats,
		categoriesPlaylists: Promise.all(
			randomCatsRes.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
