<script lang="ts">
	import '../app.css';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	
	import { initTheme } from '$lib/theme';
	import { language } from '$lib/translations';
	
	import type { PageData } from './$types';

	const queryClient = new QueryClient();

	onMount(() => {
		initTheme();

		$language = data.language;
	});

	export let data: PageData;
</script>

<Toaster />

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
