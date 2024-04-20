<script lang="ts">
	import { LogoutButton, Button } from '$components';
	import Navigation from '$components/Navigation.svelte';
	import '../app.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: user = data.user;
</script>

<div id="main">
	{#if user}
		<div id="sidebar">
			<Navigation desktop={true} />
		</div>
	{/if}
	<div id="content">
		<main id="main-content">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		display: flex;
		#content {
			flex: 1;
			#main-content {
				padding: 30px 15px 60px;
				@media only screen and (max-width: 1000px) {
				}
			}
		}
	}
</style>
