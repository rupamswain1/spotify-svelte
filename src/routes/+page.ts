import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/spotify/browse/new-release?limit=6');
	const res2 = await fetch('/api/spotify/browse/featured-playlists?limit=6');
	console.log(await res.json());
	console.log(await res2.json());
};
