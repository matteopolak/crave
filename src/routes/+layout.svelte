<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-french-toast';

	import { initTheme } from '$lib/theme';
	import type { PageData } from './$types';
	import { language } from '$lib/translations';

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
