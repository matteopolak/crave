import { TEXT_EMBEDDER_PORT } from '$env/static/private';

import { z } from 'zod';
import axios from 'axios';
import { TRPCError } from '@trpc/server';

import { procedure, protectedProcedure, router } from '$lib/server/trpc';
import { Id, PartialRecipe, Recipe } from '$lib/server/schema';

import vector from './vector';
import { transformAuthor, type FlatAuthor, SELECT_PARTIAL_RECIPE, SELECT_AUTHOR } from '$lib/server/sql';

const ai = axios.create({
	baseURL: `http://127.0.0.1:${TEXT_EMBEDDER_PORT}`,
	validateStatus: () => true,
});

export default router({
	vector,
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
		.query(async ({ input, ctx }) => {
			const vector = await ai.post('/', {
				text: input.text,
			});

			const result = await ctx.db.query<{ title: string }>(
				`SELECT
					title
				FROM recipe
				ORDER BY
					embedding <#> $1
				LIMIT 10`,
				[`[${vector.data.embedding.join(',')}]`],
			);

			return result.rows;
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
		.input(z.object({ text: z.string(), includeEmbeddings: z.boolean().default(false) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const vector = await ai.post('/', {
				text: input.text,
			});

			const result = await ctx.db.query<PartialRecipe & FlatAuthor>(
				`SELECT
					${SELECT_AUTHOR},
					${SELECT_PARTIAL_RECIPE}
					${input.includeEmbeddings ? ',"recipe".embedding' : ''}
				FROM recipe
				LEFT JOIN "user" ON "user".id = recipe.author_id
				ORDER BY
					embedding <#> $1
				LIMIT 50`,
				[`[${vector.data.embedding.join(',')}]`],
			);

			return result.rows.map(transformAuthor);
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
		.input(z.object({ id: z.number(), includeEmbeddings: z.boolean().default(false) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<PartialRecipe & FlatAuthor>(
				`SELECT
					${SELECT_AUTHOR},
					${SELECT_PARTIAL_RECIPE}
					${input.includeEmbeddings ? ',"recipe".embedding' : ''}
				FROM recipe
				LEFT JOIN "user" ON "user".id = recipe.author_id
				WHERE
					"recipe".id != $1 AND "recipe".embedding <#> (
						SELECT r.embedding FROM recipe r WHERE r.id = $1
					) < -0.7
					${ctx.session ? `AND
					"recipe".id NOT IN (
						SELECT recipe_id FROM history WHERE user_id = $2
					)` : ''}
				ORDER BY random()
				LIMIT 25`,
				ctx.session ? [input.id, ctx.session.user.userId] : [input.id],
			);

			if (!result.rows.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			return result.rows.map(transformAuthor);
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
		.input(z.object({ includeEmbeddings: z.boolean().default(false), limit: z.number().min(1).max(100).int().default(50) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<PartialRecipe & FlatAuthor>(
				`SELECT
					${SELECT_AUTHOR},
					${SELECT_PARTIAL_RECIPE}
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe TABLESAMPLE SYSTEM_ROWS($1)
				LEFT JOIN "user" ON "user".id = recipe.author_id
				${ctx.session ? `WHERE
					"recipe".id NOT IN (
						SELECT recipe_id FROM history WHERE user_id = $2
					)` : ''}`,
				ctx.session ? [input.limit, ctx.session.user.userId] : [input.limit],
			);

			return result.rows.map(transformAuthor);
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
		.input(z.object({ id: Id, includeEmbeddings: z.boolean().default(false) }))
		.output(Recipe)
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<Recipe & FlatAuthor>(
				`SELECT
					${SELECT_AUTHOR},
					${SELECT_PARTIAL_RECIPE},
					quantities,
					directions,
					energy,
					fat,
					saturated_fat,
					protein,
					salt,
					sugar,
					url,
					(SELECT COUNT(*)::int FROM "like" WHERE recipe_id = "recipe".id) AS likes
					${ctx.session ? ',EXISTS(SELECT 1 FROM "like" WHERE recipe_id = "recipe".id AND user_id = $2) AS liked' : ''}
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe
				LEFT JOIN "user" ON "user".id = recipe.author_id
				WHERE
					"recipe".id = $1`,
				ctx.session ? [input.id, ctx.session.user.userId] : [input.id],
			);

			if (!result.rows.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			// insert history entry if the user is logged in
			if (ctx.session) {
				// it will only be inserted if the last history entry is not the same recipe
				await ctx.db.query('CALL add_history($1, $2)', [ctx.session.user.userId, input.id]);
			} else {
				result.rows[0].liked = false;
			}

			return transformAuthor(result.rows[0]);
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
			await ctx.db.query<{ likes: number }>(
				`INSERT INTO "like" (user_id, recipe_id) VALUES ($1, $2)
				ON CONFLICT (user_id, recipe_id) DO NOTHING;`,
				[ctx.session.user.userId, input.id],
			);
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
			await ctx.db.query<{ likes: number }>(
				'DELETE FROM "like" WHERE user_id = $1 AND recipe_id = $2;',
				[ctx.session.user.userId, input.id],
			);
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
			const result = await ctx.db.query<PartialRecipe & FlatAuthor>(
				`SELECT
						${SELECT_AUTHOR},
						${SELECT_PARTIAL_RECIPE}
					FROM recipe
					JOIN "like" ON "like".recipe_id = recipe.id
					LEFT JOIN "user" ON "user".id = recipe.author_id
					WHERE
						"like".user_id = $1
					ORDER BY "like".created_at DESC`,
				[ctx.session.user.userId],
			);

			return result.rows.map(transformAuthor);
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
			const result = await ctx.db.query<PartialRecipe & FlatAuthor>(
				`SELECT
					${SELECT_AUTHOR},
					${SELECT_PARTIAL_RECIPE}
				FROM recipe
				JOIN history ON history.recipe_id = recipe.id
				LEFT JOIN "user" ON "user".id = recipe.author_id
				WHERE
					user_id = $1
				ORDER BY "history".created_at DESC`,
				[ctx.session.user.userId],
			);

			return result.rows.map(transformAuthor);
		}),
});
