import { router } from '$lib/server/trpc';

import recipes from './recipes';
import users from './users';

export const app = router({
	recipes,
	users,
});

export default app;
export type Router = typeof app;
