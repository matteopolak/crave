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
		verified: z.boolean(),
		createdAt: CreatedAt,
		recipes: z.number().nonnegative().int().optional(),
		subscribers: z.number().nonnegative().int().optional(),
		subscribed: z.boolean().optional(),
	});

export type User = z.infer<typeof User>;

export const Nutrition = z.object({
	calories: z.number().nonnegative('Calories must be a non-negative number.'),
	fat: z.number().nonnegative('Fat must be a non-negative number.'),
	saturatedFat: z.number().nonnegative('Saturated fat must be a non-negative number.'),
	protein: z.number().nonnegative('Protein must be a non-negative number.'),
	sodium: z.number().nonnegative('Sodium must be a non-negative number.'),
	sugar: z.number().nonnegative('Sugar must be a non-negative number.'),
});

export const PartialRecipe = z.object({
	id: Id,
	author: User,
	title: z.string().min(3, 'Recipe title must be at least 10 characters in length.'),
	thumbnail: z.string().min(1, 'Recipe thumbnail is required.'),
	tags: z.string().min(1, 'Tags must contain at least 1 character.').array(),
	embedding: Embedding.optional(),

	views: z.number().nonnegative().int(),
	createdAt: CreatedAt,
});

export type PartialRecipe = z.infer<typeof PartialRecipe>;
export type Embedding = z.infer<typeof Embedding>;

export const Recipe = z.object({
	liked: z.boolean(),
	likes: z.number().nonnegative().int(),
	ingredients: z.string().min(5, 'Ingredients must be at least 5 characters in length.').array().min(1, 'At least one ingredient is required.'),
	directions: z.string().min(5, 'Directions must be at least 5 characters in length').array().min(1, 'At least one direction is required.'),
	url: z.string().url().nullable(),
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
