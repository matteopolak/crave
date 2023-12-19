import type { User } from './schema';

export const SELECT_AUTHOR = `"user".id AS author_id,
"user".username AS author_username,
"user".name AS author_name,
"user".created_at AS author_created_at`;
export const SELECT_PARTIAL_RECIPE = `"recipe".id,
"recipe".title,
"recipe".ingredients,
"recipe".thumbnail,
"recipe".created_at,
(SELECT COUNT(*)::int FROM history WHERE recipe_id = "recipe".id) AS views`;

export type FlatAuthor = {
	author_id: string;
	author_username: string;
	author_name: string;
	author_created_at: string;
};

export type Author = {
	author: User;
}

export function transformAuthor<T>(row: T & FlatAuthor & Author): T & Author {
	row.author = row.author_id ? {
		id: row.author_id,
		username: row.author_username,
		name: row.author_name,
		created_at: row.author_created_at,
	} : {
		id: 'crave',
		username: 'crave',
		name: 'Crave',
		created_at: new Date().toISOString(),
	};

	const author = row as Partial<FlatAuthor>;

	author.author_id = undefined;
	author.author_username = undefined;
	author.author_name = undefined;
	author.author_created_at = undefined;

	return row;
}