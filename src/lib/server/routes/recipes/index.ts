import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { and, asc, desc, eq, lt, ne, notInArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { TEXT_EMBEDDER_PORT } from '$env/static/private';
import { db } from '$lib/server/db';
import { history, like, recipe, user } from '$lib/server/db/schema';
import { completeRecipe, maxInnerProduct, partialRecipe, random } from '$lib/server/db/select';
import { Id, PartialRecipe, Recipe } from '$lib/server/schema';
import { get } from '$lib/server/sentry';
import { procedure, protectedProcedure, router } from '$lib/server/trpc';

import vector from './vector';

const ai = axios.create({
	baseURL: `http://127.0.0.1:${TEXT_EMBEDDER_PORT}`,
	validateStatus: () => true,
});

export default router({
	vector,
	create: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes',
				summary: 'Create recipe',
				description: 'Creates a recipe.',
				tags: ['recipe'],
			},
		})
		.input(Recipe.pick({
			title: true,
			thumbnail: true,
			ingredients: true,
			directions: true,
			tags: true,
			calories: true,
			fat: true,
			saturatedFat: true,
			protein: true,
			sodium: true,
			sugar: true,
		}))
		.output(z.object({ id: Id }))
		.mutation(async ({ input, ctx }) => {
			const vector = await ai.post('/', {
				text: `${input.title} ${input.tags.join(' ')}`,
			});

			const recipes = await get(db
				.insert(recipe)
				.values({
					authorId: ctx.session.user.userId,
					title: input.title,
					thumbnail: input.thumbnail,
					ingredients: input.ingredients,
					directions: input.directions,
					tags: input.tags,
					calories: input.calories,
					fat: input.fat,
					saturatedFat: input.saturatedFat,
					protein: input.protein,
					sodium: input.sodium,
					sugar: input.sugar,
					embedding: vector.data.embedding,
				})
				.returning({
					id: recipe.id,
				}));

			return recipes[0];
		}),
	autocomplete: procedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes/autocomplete',
				summary: 'Autocomplete',
				description: 'Performs an autocomplete search with a specific text.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ text: z.string(), includeEmbeddings: z.boolean().default(false) }))
		.output(z.object({ title: z.string() }).array())
		.query(async ({ input }) => {
			const vector = await ai.post('/', {
				text: input.text,
			});

			const recipes = await get(db
				.select({ title: recipe.title })
				.from(recipe)
				.orderBy(maxInnerProduct(recipe.embedding, vector.data.embedding as number[]))
				.limit(10));

			return recipes;
		}),
	search: procedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes/search',
				summary: 'Search',
				description: 'Performs a search with a specific text.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ text: z.string() }))
		.output(PartialRecipe.array())
		.query(async ({ input }) => {
			const vector = await ai.post('/', {
				text: input.text,
			});

			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.orderBy(maxInnerProduct(recipe.embedding, vector.data.embedding))
				.limit(50));

			return recipes;
		}),
	recommended: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/recipes/{id}/recommended',
				summary: 'Recommended recipes',
				description: 'Gets recommended recipes for a specific recipe that haven\'t been seen yet.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ id: z.number() }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const e = db
				.select({ embedding: recipe.embedding })
				.from(recipe)
				.where(eq(recipe.id, input.id));

			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.where(and(
					ne(recipe.id, input.id),
					lt(maxInnerProduct(recipe.embedding, e), -0.65),
					ctx.session ? ne(recipe.id, input.id) : undefined,
				))
				.orderBy(random())
				.limit(25));

			if (!recipes.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			return recipes;
		}),
	random: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/recipes/random',
				summary: 'Random recipes',
				description: 'Gets random recipes that haven\'t been seen yet.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ limit: z.number().int().min(1).max(100).default(50) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const h = ctx.session && db
				.select({ recipeId: history.recipeId })
				.from(history)
				.where(eq(history.userId, ctx.session.user.userId));

			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.where(h ? notInArray(recipe.id, h) : undefined)
				.orderBy(random())
				.limit(input.limit));

			return recipes;
		}),
	get: procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/recipes/{id}',
				summary: 'Get recipe',
				description: 'Gets a specific recipe.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ id: Id }))
		.output(Recipe)
		.query(async ({ input, ctx }) => {
			const recipes = await get(db
				.select(completeRecipe(ctx.session?.user.userId))
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.where(eq(recipe.id, input.id)));

			if (!recipes.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			if (ctx.session) {
				await db.execute(sql`CALL add_history(${ctx.session.user.userId}, ${input.id})`);
			}

			return recipes[0];
		}),
	like: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes/{id}/like',
				summary: 'Like recipe',
				description: 'Likes a specific recipe.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ id: Id }))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await get(db.insert(like)
				.values({
					userId: ctx.session.user.userId,
					recipeId: input.id,
				})
				.onConflictDoNothing({
					target: [like.userId, like.recipeId],
				}));
		}),
	unlike: protectedProcedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes/{id}/unlike',
				summary: 'Unlike recipe',
				description: 'Unlikes a specific recipe.',
				tags: ['recipe'],
			},
		})
		.input(z.object({ id: Id }))
		.output(z.void())
		.mutation(async ({ input, ctx }) => {
			await get(db.delete(like)
				.where(and(
					eq(like.userId, ctx.session.user.userId),
					eq(like.recipeId, input.id),
				)));
		}),
	liked: protectedProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/recipes/liked',
				summary: 'Liked recipes',
				description: 'Gets the current user\'s liked recipes.',
				tags: ['recipe'],
			},
		})
		.input(z.void())
		.output(PartialRecipe.array())
		.query(async ({ ctx }) => {
			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.innerJoin(like, eq(recipe.id, like.recipeId))
				.where(eq(like.userId, ctx.session.user.userId))
				.orderBy(desc(like.createdAt), asc(recipe.id)));

			return recipes;
		}),
	history: protectedProcedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/recipes/history',
				summary: 'History',
				description: 'Gets the current user\'s history.',
				tags: ['recipe'],
			},
		})
		.input(z.void())
		.output(PartialRecipe.array())
		.query(async ({ ctx }) => {
			const recipes = await get(db
				.select(partialRecipe)
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.innerJoin(history, eq(recipe.id, history.recipeId))
				.where(eq(history.userId, ctx.session.user.userId))
				.orderBy(desc(history.createdAt), asc(recipe.id)));

			return recipes;
		}),
});
