import { app } from '$lib/server/router';
import { json } from '@sveltejs/kit';
import { generateOpenApiDocument } from 'trpc-openapi';
import type { RequestHandler } from './$types';
import { HOST_URL } from '$env/static/private';

const openApiDocument = generateOpenApiDocument(app, {
	title: 'tRPC OpenAPI',
	version: '1.0.0',
	baseUrl: HOST_URL,
});

export const GET: RequestHandler = () => {
	return json(openApiDocument);
};
