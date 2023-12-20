import { and, eq, type SQL, sql, type SQLWrapper } from 'drizzle-orm';

import { db } from '.';
import * as s from './schema';

export function exists(subquery: SQLWrapper): SQL<boolean> {
	return sql`exists (${subquery})`;
}

export function count(): SQL<number> {
	return sql`count(*)::int`;
}

export function random(): SQL<number> {
	return sql`random()`;
}

export function maxInnerProduct(lhs: SQLWrapper, rhs: SQLWrapper): SQL<number> {
	return sql`${lhs} <#> ${rhs}`;
}

export const views = sql<number>`${db
	.select({ value: count().as('views') })
	.from(s.history)
	.where(eq(s.history.recipeId, s.recipe.id))}`;

export const user = {
	id: s.user.id,
	username: s.user.username,
	name: s.user.name,
	createdAt: s.user.createdAt,
};

const liked = (userId?: string) => userId ? exists(db
	.select({ value: sql`1` })
	.from(s.like)
	.where(and(
		eq(s.like.recipeId, s.recipe.id),
		eq(s.like.userId, userId),
	)))
	.as('l')
	: sql<boolean>`false`;

const likes = db
	.select({ value: count() })
	.from(s.like)
	.where(eq(s.like.recipeId, s.recipe.id));

export const partialRecipe = {
	id: s.recipe.id,
	title: s.recipe.title,
	ingredients: s.recipe.ingredients,
	thumbnail: s.recipe.thumbnail,
	createdAt: s.recipe.createdAt,
	author: user,
	views,
};

export const completeRecipe = (userId?: string) => ({
	...partialRecipe,
	quantities: s.recipe.quantities,
	directions: s.recipe.directions,
	energy: s.recipe.energy,
	fat: s.recipe.fat,
	saturatedFat: s.recipe.saturatedFat,
	protein: s.recipe.protein,
	salt: s.recipe.salt,
	sugar: s.recipe.sugar,
	url: s.recipe.url,
	liked: liked(userId),
	likes: sql<number>`${likes}`,
});