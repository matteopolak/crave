<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { parseFromQuery } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(async () => {
		await invalidateAll();
		goto(parseFromQuery($page.url) ?? '/');
	});
</script>
