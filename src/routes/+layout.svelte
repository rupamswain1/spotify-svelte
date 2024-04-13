<script lang="ts">
	import LogoutButton from '$components/LogoutButton.svelte';
	import '../app.css';
	import '../styles/main.scss';
	import type {LayoutData} from './$types'; 
	export let data: LayoutData;
	$: user = data.user;
</script>

{#if user}
	<p>Hello {user.display_name}</p>
	<LogoutButton/>
{/if}



<slot />
