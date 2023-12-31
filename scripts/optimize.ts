import 'dotenv/config';

import { asc, isNotNull, ne } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as schema from '../src/lib/server/db/schema';
import { optimizeImage } from '../src/lib/server/image';

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

(async () => {
	for (let i = 0; ; ++i) {
		const thumbnails = await db.select({
			id: schema.recipe.id,
			thumbnail: schema.recipe.thumbnail,
		})
			.from(schema.recipe)
			.where(ne(schema.recipe.authorId, '000000000000000'))
			.orderBy(asc(schema.recipe.id))
			.offset(i * 250)
			.limit(50);

		if (!thumbnails.length) {
			break;
		}

		await Promise.all(thumbnails.map(async ({ id, thumbnail }) => {
			const [url, base64] = thumbnail.split(',');

			if (!base64 || !url.startsWith('data:')) {
				return;
			}

			const image = await optimizeImage(base64);

			await db.update(schema.recipe)
				.set({ thumbnail: image })
				.where(eq(schema.recipe.id, id));

			console.log(`optimized recipe ${id}`);
		}));
	}
})();