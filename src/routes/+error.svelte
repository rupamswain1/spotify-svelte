<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import LogoutButton from '$components/LogoutButton.svelte';
	let isRetrying = false;
	const retryRoutes = ['/album/[id]'];
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="content">
	<h1>{$page.error?.message}</h1>
	{#if $page.status === 404}
		<p>The page you are trying to access cannot be found</p>
		<div class="buttons">
			<Button element="a" href="/">Home</Button>
			<Button element="a" href="/search">Search</Button>
		</div>
	{/if}
	{#if $page.status === 500}
		<p>Your Current Status has expired, please logout and login again</p>
		<div class="buttons">
			<LogoutButton />
		</div>
	{/if}
	{#if ![404, 401].includes($page.status) && $page.route.id && retryRoutes.includes($page.route.id)}
		<div class="buttons">
			<Button
				element="button"
				disabled={isRetrying}
				on:click={async () => {
					isRetrying = true;
					await invalidate(`app:${$page.route.id}`);
					isRetrying = false;
				}}>Retry</Button
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.content {
		text-align: center;
	}
	h1 {
		font-size: 2.5rem;
	}
	p {
		font-size: 1.5rem;
	}
	.buttons {
		margin-top: 40px;
		:global(a) {
			margin: 0 5px;
		}
	}
</style>
