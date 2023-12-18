import type { Router } from '$lib/server/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: 'http://localhost:5173/api/',
		}),
	],
});
