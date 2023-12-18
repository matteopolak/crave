import { z } from 'zod';

export const Id = z.number().int().nonnegative();
export const Embedding = z.number().array().length(768);
export const RawEmbedding = z.string();

export const WithEmbedding = z.object({
	embedding: Embedding,
});

export const Nutrition = z.object({
	energy: z.number().nonnegative(),
	fat: z.number().nonnegative(),
	saturated_fat: z.number().nonnegative(),
	protein: z.number().nonnegative(),
	salt: z.number().nonnegative(),
	sugar: z.number().nonnegative(),
});

export const PartialRecipe = z.object({
	id: Id,
	title: z.string(),
	thumbnail: z.string().url(),
	ingredients: z.string().array(),
	embedding: RawEmbedding.optional(),
});

export type PartialRecipe = z.infer<typeof PartialRecipe>;
export type WithEmbedding = z.infer<typeof WithEmbedding>;
export type Embedding = z.infer<typeof Embedding>;

export const Recipe = z.object({
	quantities: z.string().array(),
	directions: z.string().array(),
	url: z.string().url(),
})
	.merge(Nutrition)
	.merge(PartialRecipe);

export type Recipe = z.infer<typeof Recipe>;
