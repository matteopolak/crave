import type { User } from './schema';

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
		id: 'system',
		username: 'system',
		name: 'System',
		created_at: new Date().toISOString(),
	};

	const author = row as Partial<FlatAuthor>;

	author.author_id = undefined;
	author.author_username = undefined;
	author.author_name = undefined;
	author.author_created_at = undefined;

	return row;
}