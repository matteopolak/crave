import { router } from '$lib/server/trpc';

import recipes from './recipes';
import user from './user';

export const app = router({
	recipes,
	user,
});

export default app;
export type Router = typeof app;
