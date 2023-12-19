import { integer, pgTable, serial, text, timestamp, varchar, bigint, real } from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	username: varchar('username', { length: 39 }).notNull().unique(),
	embedding: vector('embedding', { dimension: 768 }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Keep track of a user's recipes
// TODO: CREATE INDEX ON recipe USING hnsw (embedding vector_ip_ops);
export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	authorId: text('author_id').references(() => user.id),
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
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Keep track of a user's recipe viewing history
export const history = pgTable('history', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	recipeId: integer('recipe_id').notNull().references(() => recipe.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
// Keep track of a user's subscriptions
export const subscription = pgTable('subscription', {
	userId: text('user_id').notNull().references(() => user.id),
	channelId: text('channel_id').references(() => user.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Keep track of a user's likes
export const like = pgTable('like', {
	userId: text('user_id').notNull().references(() => user.id),
	recipeId: integer('recipe_id').notNull().references(() => recipe.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

export const userKey = pgTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	password: text('hashed_password'),
});

export const userSession = pgTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	activeExpires: bigint('active_expires', { mode: 'bigint' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'bigint' }).notNull(),
});