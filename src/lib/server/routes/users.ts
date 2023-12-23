import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm/sql';
import { z } from 'zod';

import { procedure, protectedProcedure, router } from '$lib/server/trpc';

import { db } from '../db';
import { recipe, subscription, user } from '../db/schema';
import { count, partialRecipe, subscribed, user as userSelect } from '../db/select';
import { PartialRecipe, User } from '../schema';
import { get } from '../sentry';

export default router({
	subscribe: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/users/@{username}/subscribe',
				summary: 'Subscribe',
				description: 'Subscribes to a user.',
				tags: ['user'],
			},
		})
		.input(z.object({ username: z.string().toLowerCase() }))
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			const users = await get(db
				.select({
					id: user.id,
				})
				.from(user)
				.where(eq(user.username, input.username)));

			if (!users.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found.',
				});
			}

			await get(db
				.insert(subscription)
				.values({
					userId: ctx.session.user.userId,
					channelId: users[0].id,
				})
				.onConflictDoNothing());
		}),
	unsubscribe: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/users/@{username}/unsubscribe',
				summary: 'Unsubscribe',
				description: 'Unsubscribes from a user.',
				tags: ['user'],
			},
		})
		.input(z.object({ username: z.string().toLowerCase() }))
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			const users = await get(db
				.select({
					id: user.id,
				})
				.from(user)
				.where(eq(user.username, input.username)));

			if (!users.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found.',
				});
			}

			await get(db
				.delete(subscription)
				.where(and(
					eq(subscription.userId, ctx.session.user.userId),
					eq(subscription.channelId, users[0].id),
				)));
		}),
	get: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/users/@{username}',
				summary: 'Get user',
				description: 'Gets a user\'s profile',
				tags: ['user'],
			},
		})
		.input(z.object({ username: z.string().toLowerCase() }))
		.output(User)
		.query(async ({ ctx, input }) => {
			const users = await get(db
				.select({
					...userSelect,
					subscribed: subscribed(ctx.session?.user.userId),
					recipes: sql<number>`${db
						.select({ value: count() })
						.from(recipe)
						.where(eq(recipe.authorId, user.id))}`,
					subscribers: sql<number>`${db
						.select({ value: count() })
						.from(subscription)
						.where(eq(subscription.channelId, user.id))}`,
				})
				.from(user)
				.where(eq(user.username, input.username)));

			if (!users.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found.',
				});
			}

			return users[0];
		}),
	recipes: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/users/@{username}/recipes',
				summary: 'Get user recipes',
				description: 'Gets a user\'s recipes',
				tags: ['user'],
			},
		})
		.input(z.object({ username: z.string().toLowerCase(), page: z.number().int().nonnegative().default(0) }))
		.output(PartialRecipe.array())
		.query(async ({ input }) => {
			const authorId = db
				.select({
					id: user.id,
				})
				.from(user)
				.where(eq(user.username, input.username));

			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.where(eq(recipe.authorId, authorId))
				.orderBy(desc(recipe.createdAt), asc(recipe.id))
				.offset(input.page * 25)
				.limit(25));

			return recipes;
		}),
	subscriptions: protectedProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/users/me/subscriptions',
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

			return await get(db
				.select({
					id: user.id,
					name: user.name,
					username: user.username,
					createdAt: user.createdAt,
				})
				.from(user)
				.where(inArray(user.id, subscriptions)));
		}),
});
