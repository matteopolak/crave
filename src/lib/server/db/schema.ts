import { sql } from 'drizzle-orm';
import { bigint, boolean, index, integer, pgTable, primaryKey, real, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { vector } from 'pgvector/drizzle-orm';

export const user = pgTable('user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name').notNull(),
	username: varchar('username', { length: 39 }).notNull().unique(),
	embedding: vector('embedding', { dimension: 768 }),
	verified: boolean('verified').notNull().default(false),
	thumbnail: text('thumbnail'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	authorId: text('author_id').notNull().references(() => user.id),
	embedding: vector('embedding', { dimension: 768 }),
	title: text('title').notNull().unique(),
	thumbnail: text('thumbnail').notNull(),
	url: text('url'),
	ingredients: text('ingredients').array().notNull(),
	directions: text('directions').array().notNull(),
	tags: text('tags').array().notNull(),
	calories: real('calories').notNull(),
	fat: real('fat').notNull(),
	saturatedFat: real('saturated_fat').notNull(),
	protein: real('protein').notNull(),
	sodium: real('sodium').notNull(),
	sugar: real('sugar').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		authorIdx: index().on(table.authorId),
		embeddingIdx: sql`CREATE INDEX IF NOT EXISTS "recipe_embedding_index" ON ${table} USING hnsw (${table.embedding} vector_ip_ops)`,
	}
});

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

export const like = pgTable('like', {
	userId: text('user_id').notNull().references(() => user.id),
	recipeId: integer('recipe_id').notNull().references(() => recipe.id),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => {
	return {
		userIdx: index().on(table.userId),
		recipeIdx: index().on(table.recipeId),
		userRecipePkey: primaryKey({ columns: [table.userId, table.recipeId] }),
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
