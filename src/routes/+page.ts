import type { PageLoad } from './$types';
import { fetchRefresh } from '$helpers';

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
	const fetch = (path: string) => fetchRefresh(_fetch, path);
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
	const randomCatsPromises = randomCats.map((cat) =>
		fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`)
	);
	const [newReleasesRes, featuredPlayListsRes, userPlayListsRes, ...randomCatsRes] =
		await Promise.all([newReleases, featuredPlayLists, userPlayLists, ...randomCatsPromises]);

	return {
		newReleases: newReleasesRes.ok
			? ((await newReleasesRes.json()) as SpotifyApi.ListOfNewReleasesResponse)
			: undefined,
		featuredPlaylists: featuredPlayListsRes.ok
			? ((await featuredPlayListsRes.json()) as SpotifyApi.ListOfFeaturedPlaylistsResponse)
			: undefined,
		userPlayLists: userPlayListsRes.ok
			? ((await userPlayListsRes.json()) as SpotifyApi.ListOfUsersPlaylistsResponse)
			: undefined,
		homeCategories: randomCats,
		categoriesPlaylists: await Promise.all(
			randomCatsRes.map(async (res) => {
				if (res.ok) {
					const json = await res.json();
					return json as SpotifyApi.CategoryPlaylistsResponse;
				} else {
					return undefined;
				}
			})
		)
	};
};
