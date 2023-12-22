import { json } from '@sveltejs/kit';
import { generateOpenApiDocument } from 'trpc-openapi';

import { PUBLIC_BASE_URL } from '$env/static/public';
import { app } from '$lib/server/routes';

import type { RequestHandler } from './$types';

const openApiDocument = generateOpenApiDocument(app, {
	title: 'Crave API',
	version: '1.0.0',
	baseUrl: PUBLIC_BASE_URL,
	// @ts-expect-error - defined in Redoc spec
	license: {
		name: 'MIT',
		url: 'https://github.com/matteopolak/crave/blob/main/LICENSE',
	},
	termsOfService: '/terms',
	'x-logo': {
		url: '/favicon.svg',
		altText: 'Crave Logo',
	},
});

openApiDocument.tags = [
	{
		name: 'user',
		description: 'User related endpoints',
		// @ts-expect-error - defined in Redoc spec
		'x-displayName': 'User',
	},
]

export const GET: RequestHandler = () => {
	return json(openApiDocument);
};
