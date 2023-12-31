import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db/index.js';
import { recipe } from '$lib/server/db/schema.js';
import { get } from '$lib/server/sentry.js';

export const GET = async ({ params }) => {
	const recipes = await get(db
		.select({
			thumbnail: recipe.thumbnail,
		})
		.from(recipe)
		.where(eq(recipe.id, parseInt(params.id))),
	);

	if (!recipes.length) {
		return new Response(null, {
			status: 404,
		});
	}

	if (recipes[0].thumbnail.startsWith('http')) {
		return Response.redirect(recipes[0].thumbnail, 301);
	}

	const buffer = Buffer.from(recipes[0].thumbnail, 'base64');

	return new Response(buffer, {
		status: 200,
		headers: {
			'Content-Type': 'image/webp',
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
