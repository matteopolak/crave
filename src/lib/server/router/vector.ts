import { procedure, router } from '$lib/server/trpc';
import { z } from 'zod';
import { PartialRecipe } from '../schema';

export default router({
	search: procedure
		.meta({ openapi: { method: 'POST', path: '/vector/search' } })
		.input(z.object({
			vector: z.number().array().length(768),
			includeEmbeddings: z.boolean().default(false),
			limit: z.number().min(1).max(100).int().default(10),
		}))
		.output(PartialRecipe.array())
		.mutation(async ({ input, ctx }) => {
			const result = await ctx.db.query<PartialRecipe>(
				`SELECT
					id,
					title,
					ingredients,
					thumbnail
					${input.includeEmbeddings ? ',embedding' : ''}
				FROM recipe WHERE
				embedding <#> $1 < -0.7
				ORDER BY random()
				LIMIT $2`,
				[`[${input.vector.join(',')}]`, input.limit],
			);

			return result.rows;
		}),
});
