<script lang="ts">
	import { Music } from 'lucide-svelte';

	export let color: string | null;
	export let image: string | undefined;
	export let title: string;
	export let type: string | undefined;
</script>

<div class="banner">
	<div
		class="banner-gradient"
		style:background-image="linear-gradient(0deg, transparent, {color || 'var(--light-gray)'})"
	/>
	<div class="cover">
		{#if image}
			<img src={image} alt={title} />
		{:else}
			<div class="cover-placeholder">
				<Music focusable="false" aria-hidden color="var(--light-gray)" } />
			</div>
		{/if}
	</div>
	<div class="info">
		{#if type}
			<p class="type">{type}</p>
		{/if}
		<h1 class="title">{title}</h1>
		<slot name="meta" />
	</div>
</div>
<div class="content">
	<slot />
</div>

<style lang="scss">
	.content {
		position: relative;
		z-index: 10;
		min-height: 300px;
		background-image: linear-gradient(0deg, var(--bg-color), rgba(0, 0, 0, 0.1));
		margin:
			0,
			-30px;
		padding: 30px;
	}
	.banner {
		position: relative;
		display: flex;
		flex-direction: columns;
		margin: calc(-1 * (30px + var(--header-height))) -30px 0;
		padding: calc(30px + var(--header-height)) 30px 20px;
		@media only screen and (min-width: 425px) {
			flex-direction: row;
			align-items: flex-end;
		}
		.banner-gradient {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 150%;
			z-index: 1;
		}
		.info {
			z-index: 10;
			.type {
				text-transform: uppercase;
				font-weight: 600;
				font-size: 0.7rem;
				margin: 0;
			}
			.title {
				font-size: 2rem;
				margin: 5px 0 0;
				@media only screen and (min-width: 768px) {
					font-size: 2.1rem;
				}
				@media only screen and (min-width: 1024px) {
					font-size: 3rem;
				}
			}
		}
		.cover {
			z-index: 10;
			margin-right: 40px;
			img,
			.cover-placeholder {
				width: 100%;
				aspect-ratio: 1;
				object-fit: cover;
				box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
				@media only screen and (min-width: 425px) {
					width: 230px;
				}
				@media only screen and (min-width: 768px) {
					width: 200px;
				}
				@media only screen and (min-width: 1024px) {
					width: 230px;
				}
			}
			.cover-placeholder {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--medium-gray);
				:global(svg) {
					width: 40%;
					height: 40%;
				}
			}
		}
	}
</style>
