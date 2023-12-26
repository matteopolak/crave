<script lang="ts">
	import '../app.css';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-french-toast';

	const queryClient = new QueryClient();
</script>

<Toaster />

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
