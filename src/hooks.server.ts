import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

import { createContext } from '$lib/server/context';
import { auth } from '$lib/server/lucia';
import router from '$lib/server/routes';

const handleTrpc: Handle = createTRPCHandle({ router, createContext, url: '/api' });

const handleAuth: Handle = ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return resolve(event);
};

export const handle = sequence(handleAuth, handleTrpc);
