import { protectedProcedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import { User } from '../schema';

export default router({
	me: protectedProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/user/@me',
				summary: 'Get user',
				description: 'Gets the current user.',
				tags: ['user'],
			},
		})
		.input(z.void())
		.output(User)
		.query(async ({ ctx }) => {
			const result = await ctx.db.query<User>(
				`SELECT
					id,
					name,
					username,
					created_at
				FROM "user"
				WHERE username = $1`,
				[ctx.session.user.username],
			);

			return result.rows[0];
		}),
	subscriptions: protectedProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/user/@me/subscriptions',
				summary: 'Get subscriptions',
				description: 'Gets the current user\'s subscriptions.',
				tags: ['user'],
			},
		})
		.input(z.void())
		.output(User.array())
		.query(async ({ ctx }) => {
			const result = await ctx.db.query<User>(
				`SELECT
					id,
					name,
					username,
					created_at
				FROM "user"
				WHERE id IN (
					SELECT channel_id FROM subscription WHERE user_id = $1
				)`,
				[ctx.session.user.userId],
			);

			return result.rows;
		}),
});
