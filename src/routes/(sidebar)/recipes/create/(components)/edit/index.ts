import type { inferRouterInputs } from '@trpc/server';

import type { Router } from '$lib/server/routes';

export type Recipe = inferRouterInputs<Router>['recipes']['create'];