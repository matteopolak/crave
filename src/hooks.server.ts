import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

import { createTRPCHandle } from 'trpc-sveltekit';

import { auth } from '$lib/server/lucia';
import { createContext } from '$lib/server/context';
import router from '$lib/server/routes';

const handleTrpc: Handle = createTRPCHandle({ router, createContext, url: '/api' });

const handleAuth: Handle = ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return resolve(event);
};

export const handle = sequence(handleAuth, handleTrpc);
