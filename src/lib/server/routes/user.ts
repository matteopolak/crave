import { eq, inArray } from 'drizzle-orm/sql';
import { z } from 'zod';

import { protectedProcedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { subscription, user } from '../db/schema';
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
			const users = await db
				.select({
					id: user.id,
					name: user.name,
					username: user.username,
					createdAt: user.createdAt,
				})
				.from(user)
				.where(eq(user.id, ctx.session.user.userId));

			return users[0];
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
			const subscriptions = db
				.select({
					channelId: subscription.channelId,
				})
				.from(subscription)
				.where(eq(subscription.userId, ctx.session.user.userId));

			return db
				.select({
					id: user.id,
					name: user.name,
					username: user.username,
					createdAt: user.createdAt,
				})
				.from(user)
				.where(inArray(user.id, subscriptions));
		}),
});
