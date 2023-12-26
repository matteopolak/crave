<script lang="ts">
	import { onMount } from 'svelte';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { parseFromQuery } from '$lib/util';

	onMount(async () => {
		await invalidateAll();
		goto(parseFromQuery($page.url) ?? '/');
	});
</script>
