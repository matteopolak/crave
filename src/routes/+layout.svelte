<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-french-toast';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient();
</script>

<Toaster />

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
