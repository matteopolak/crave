import { app } from '$lib/server/router';
import { json } from '@sveltejs/kit';
import { generateOpenApiDocument } from 'trpc-openapi';
import type { RequestHandler } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';

const openApiDocument = generateOpenApiDocument(app, {
	title: 'tRPC OpenAPI',
	version: '1.0.0',
	baseUrl: PUBLIC_BASE_URL,
});

export const GET: RequestHandler = () => {
	return json(openApiDocument);
};
