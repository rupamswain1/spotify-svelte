<script lang="ts">
	import { LogoutButton, Button } from '$components';
	import '../app.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: user = data.user;
</script>

<Button element="a" variant={'outline'} href>Login</Button>
<Button element="button">Login</Button>
{#if user}
	<p>Hello {user.display_name}</p>
	<LogoutButton />
{/if}

<slot />
