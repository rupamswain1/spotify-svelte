<script lang="ts">
	export let data;

	$: album = data.album;
</script>

<h5>{album.album_type}</h5>
<h1>{album.name}</h1>
