import { app } from '$lib/server/router';
import { json } from '@sveltejs/kit';
import { generateOpenApiDocument } from 'trpc-openapi';
import type { RequestHandler } from './$types';

const openApiDocument = generateOpenApiDocument(app, {
	title: 'tRPC OpenAPI',
	version: '1.0.0',
	baseUrl: 'http://localhost:3000',
});

export const GET: RequestHandler = () => {
	return json(openApiDocument);
};
