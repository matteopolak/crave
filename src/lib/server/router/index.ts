import { TEXT_EMBEDDER_PORT } from '$env/static/private';

import { procedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import axios from 'axios';
import { TRPCError } from '@trpc/server';

import { Id, PartialRecipe, Recipe } from '../schema';
import vectorRouter from './vector';
import authRouter from './auth';

const ai = axios.create({
	baseURL: `http://127.0.0.1:${TEXT_EMBEDDER_PORT}`,
	validateStatus: () => true,
});

export const app = router({
	complete: procedure
		.meta({ openapi: { method: 'POST', path: '/complete' } })
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
		.meta({ openapi: { method: 'POST', path: '/search' } })
		.input(z.object({ text: z.string(), includeEmbeddings: z.boolean().default(false) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const vector = await ai.post('/', {
				text: input.text,
			});

			const result = await ctx.db.query<PartialRecipe>(
				`SELECT
					id,
					title,
					ingredients,
					thumbnail
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe
				ORDER BY
					embedding <#> $1
				LIMIT 50`,
				[`[${vector.data.embedding.join(',')}]`],
			);

			return result.rows;
		}),
	similar: procedure
		.meta({ openapi: { method: 'GET', path: '/{id}/similar' } })
		.input(z.object({ id: z.number(), includeEmbeddings: z.boolean().default(false) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<PartialRecipe>(
				`SELECT
					id,
					title,
					ingredients,
					thumbnail
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe WHERE
					id != $1 AND embedding <#> (
						SELECT embedding FROM recipe WHERE id = $1
					) < -0.7
				ORDER BY random()
				LIMIT 25`,
				[input.id],
			);

			if (!result.rows.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			return result.rows;
		}),
	random: procedure
		.meta({ openapi: { method: 'GET', path: '/random' } })
		.input(z.object({ includeEmbeddings: z.boolean().default(false), limit: z.number().min(1).max(100).int().default(50) }))
		.output(PartialRecipe.array())
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<PartialRecipe>(
				`SELECT
					id,
					title,
					ingredients,
					thumbnail
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe TABLESAMPLE SYSTEM_ROWS($1)`,
				[input.limit],
			);

			return result.rows;
		}),
	get: procedure
		.meta({ openapi: { method: 'GET', path: '/{id}' } })
		.input(z.object({ id: Id, includeEmbeddings: z.boolean().default(false) }))
		.output(Recipe)
		.query(async ({ input, ctx }) => {
			const result = await ctx.db.query<Recipe>(
				`SELECT
					id,
					title,
					quantities,
					directions,
					ingredients,
					energy,
					fat,
					saturated_fat,
					protein,
					salt,
					sugar,
					thumbnail,
					url
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe WHERE
					id = $1`,
				[input.id],
			);

			if (!result.rows.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recipe not found.',
				});
			}

			return result.rows[0];
		}),
	vector: vectorRouter,
	auth: authRouter,
});

export default app;
export type Router = typeof app;
