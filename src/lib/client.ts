import { HOST_URL } from '$env/static/private';
import type { Router } from '$lib/server/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: new URL('/api', HOST_URL),
		}),
	],
});
