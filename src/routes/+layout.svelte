<script lang="ts">
	import { LogoutButton, Button } from '$components';
	import '../app.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: user = data.user;
</script>

{#if user}
	<p>Hello {user.display_name}</p>
	<LogoutButton />
{/if}

<div id="main">
	<div id="content">
		<main id="main-content">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		#content {
			#main-content {
				padding: 30px 15px 60px;
				@media only screen and (max-width: 1000px) {
				}
			}
		}
	}
</style>
