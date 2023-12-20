import { z } from 'zod';

export const Id = z.number().int().nonnegative();
export const Embedding = z.number().array().length(768);

export const ChannelId = z.string();
export const CreatedAt = z.coerce.date().or(z.string().datetime());

export const User = z
	.object({
		id: ChannelId,
		username: z.string(),
		name: z.string(),
		createdAt: CreatedAt,
	})
	.nullable()
	// TODO: Remove this once "Crave" is a real user
	.transform(v => v ?? undefined)
	.default({
		id: '000000000000000',
		username: 'crave',
		name: 'Crave',
		createdAt: new Date(),
	});

export type User = z.infer<typeof User>;

export const Nutrition = z.object({
	energy: z.number().nonnegative(),
	fat: z.number().nonnegative(),
	saturatedFat: z.number().nonnegative(),
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
	embedding: Embedding.optional(),

	views: z.number().nonnegative().int(),
	createdAt: CreatedAt,
});

export type PartialRecipe = z.infer<typeof PartialRecipe>;
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
	recipeId: Id,
	createdAt: CreatedAt,
});

export const Subscription = z.object({
	channel: User,
	createdAt: CreatedAt,
});

export const Like = z.object({
	recipeId: Id,
	createdAt: CreatedAt,
});
