import { bigint, index, integer, pgTable, real, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';

export const user = pgTable('user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name').notNull(),
	username: varchar('username', { length: 39 }).notNull().unique(),
	embedding: vector('embedding', { dimension: 768 }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Keep track of a user's recipes
// TODO: CREATE INDEX ON recipe USING hnsw (embedding vector_ip_ops);
export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	authorId: text('author_id').notNull().references(() => user.id),
	embedding: vector('embedding', { dimension: 768 }),
	title: text('title').notNull().unique(),
	thumbnail: text('thumbnail').notNull(),
	url: text('url').notNull(),
	quantities: text('quantities').array().notNull(),
	directions: text('directions').array().notNull(),
	ingredients: text('ingredients').array().notNull(),
	energy: real('energy').notNull(),
	fat: real('fat').notNull(),
	saturatedFat: real('saturated_fat').notNull(),
	protein: real('protein').notNull(),
	salt: real('salt').notNull(),
	sugar: real('sugar').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		authorIdx: index().on(table.authorId),
	}
});

// Keep track of a user's recipe viewing history
export const history = pgTable('history', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	recipeId: integer('recipe_id').notNull().references(() => recipe.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		userIdx: index().on(table.userId),
		recipeIdx: index().on(table.recipeId),
	}
});

// Keep track of a user's subscriptions
export const subscription = pgTable('subscription', {
	userId: text('user_id').notNull().references(() => user.id),
	channelId: text('channel_id').notNull().references(() => user.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		userIdx: index().on(table.userId),
		channelIdx: index().on(table.channelId),
	}
});

// Keep track of a user's likes
export const like = pgTable('like', {
	userId: text('user_id').notNull().references(() => user.id),
	recipeId: integer('recipe_id').notNull().references(() => recipe.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		userIdx: index().on(table.userId),
		recipeIdx: index().on(table.recipeId),
	}
});

export const userKey = pgTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull().references(() => user.id),
	password: varchar('hashed_password', { length: 255 }),
});

export const userSession = pgTable('user_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull().references(() => user.id),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
});
