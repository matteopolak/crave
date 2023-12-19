import { z } from 'zod';

import { procedure, router } from '$lib/server/trpc';
import { PartialRecipe } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { history, recipe, user } from '$lib/server/db/schema';
import { count, eq, lt, sql } from 'drizzle-orm';
import { maxInnerProduct } from 'pgvector/drizzle-orm';

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
			vector: z.number().array().length(768),
			includeEmbeddings: z.boolean().default(false),
			limit: z.number().min(1).max(100).int().default(10),
		}))
		.output(PartialRecipe.array())
		.mutation(async ({ input }) => {
			const views = db
				.select({ value: count() })
				.from(history)
				.where(eq(history.recipeId, recipe.id))
				.as('v');

			const recipes = await db
				.select({
					id: recipe.id,
					title: recipe.title,
					ingredients: recipe.ingredients,
					thumbnail: recipe.thumbnail,
					createdAt: recipe.createdAt,
					author: {
						id: user.id,
						username: user.username,
						name: user.name,
						createdAt: user.createdAt,
					},
					views: views.value,
					...(input.includeEmbeddings ? { embedding: recipe.embedding } : {}),
				})
				.from(recipe)
				.leftJoin(user, eq(recipe.authorId, user.id))
				.where(lt(maxInnerProduct(recipe.embedding, input.vector), -0.7))
				.orderBy(sql`random()`)
				.limit(input.limit);

			return recipes;
		}),
});
