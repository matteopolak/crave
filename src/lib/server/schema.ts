import { z } from 'zod';

export const Id = z.number().int().nonnegative();
export const Embedding = z.number().array().length(768);
export const RawEmbedding = z.string();

export const ChannelId = z.string().optional();
export const CreatedAt = z.coerce.date().or(z.string().datetime());

export const WithEmbedding = z.object({
	embedding: Embedding,
});

export const User = z.object({
	id: ChannelId,
	username: z.string(),
	name: z.string(),
	created_at: CreatedAt,
});

export type User = z.infer<typeof User>;

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
	author: User,
	title: z.string(),
	thumbnail: z.string().url(),
	ingredients: z.string().array(),
	embedding: RawEmbedding.optional(),

	views: z.number().nonnegative().int(),
	created_at: CreatedAt,
});

export type PartialRecipe = z.infer<typeof PartialRecipe>;
export type WithEmbedding = z.infer<typeof WithEmbedding>;
export type Embedding = z.infer<typeof Embedding>;

export const Recipe = z.object({
	liked: z.boolean(),
	likes: z.number().nonnegative().int(),
	quantities: z.string().array(),
	directions: z.string().array(),
	url: z.string().url(),
})
	.merge(Nutrition)
	.merge(PartialRecipe);

export type Recipe = z.infer<typeof Recipe>;

export const History = z.object({
	recipe_id: Id,
	created_at: CreatedAt,
});

export const Subscription = z.object({
	channel: User,
	created_at: CreatedAt,
});

export const Like = z.object({
	recipe_id: Id,
	created_at: CreatedAt,
});
