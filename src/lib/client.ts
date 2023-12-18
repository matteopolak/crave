import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Router } from '$lib/server/router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: new URL('/api', PUBLIC_BASE_URL),
		}),
	],
});
