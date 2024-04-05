<script lang="ts">
	import '../app.css';
	import '../styles/main.scss';
	import type {LayoutData} from './$types'; 

	export let data: LayoutData;
</script>

{data.user?.display_name}

<slot />
