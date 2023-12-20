import { eq, lt } from 'drizzle-orm';
import { maxInnerProduct } from 'pgvector/drizzle-orm';
import { z } from 'zod';

import { db } from '$lib/server/db';
import { recipe, user } from '$lib/server/db/schema';
import { partialRecipe, random } from '$lib/server/db/select';
import { PartialRecipe } from '$lib/server/schema';
import { get } from '$lib/server/sentry';
import { procedure, router } from '$lib/server/trpc';

export default router({
	search: procedure
		.meta({
			openapi: {
				method: 'POST',
				path: '/recipes/vector/search',
				summary: 'Vector search',
				description: 'Performs a vector search with a specific vector.',
				tags: ['recipe'],
			},
		})
		.input(z.object({
			vector: z.number().array().length(768).optional(),
			limit: z.number().min(1).max(100).int().default(10),
		}))
		.output(
			PartialRecipe
				.required({
					embedding: true,
				})
				.array(),
		)
		.mutation(async ({ input }) => {
			const recipes = await get(db
				.select({
					...partialRecipe,
					embedding: recipe.embedding,
				})
				.from(recipe)
				.innerJoin(user, eq(recipe.authorId, user.id))
				.where(input.vector ? lt(maxInnerProduct(recipe.embedding, input.vector), -0.6) : undefined)
				.orderBy(random())
				.limit(input.limit));

			return recipes;
		}),
});
