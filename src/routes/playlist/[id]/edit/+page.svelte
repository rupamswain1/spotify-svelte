<script lang="ts">
	import { PlaylistForm } from '$components';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	$: playlist = data.playlist;
</script>

<h2>{data.title}</h2>
<PlaylistForm {form} {playlist} action="?redirect" />
