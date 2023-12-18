import { protectedProcedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import { Embedding } from '../schema';

const User = z.object({
	id: z.number(),
	embedding: Embedding,
});

export type User = z.infer<typeof User>;

export default router({
	me: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/auth/me' } })
		.input(z.void())
		.output(User)
		.query(async ({ ctx }) => {
			const result = await ctx.db.query<User>(
				`SELECT
					id,
					embedding
				FROM "user"
				WHERE username = $1`,
				[ctx.session.user.username],
			);

			return result.rows[0];
		}),
});
