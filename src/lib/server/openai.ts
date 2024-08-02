import { OpenAI } from 'openai';
import { z } from 'zod';

import { OPENAI_API_KEY } from '$env/static/private';

const Recipe = z.object({
	title: z.string(),
	ingredients: z.string().array(),
	directions: z.string().array(),
	tags: z.string().array(),
	description: z.string(),
	notes: z.array(z.string()),
	attribution: z.string().optional(),
});

const client = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a recipe-creating assistant that parses an unstructured recipe and returns a structured recipe.
You must only output valid JSON with no extraneous characters or backticks, with the following format:

{
	title: string,
	ingredients: string[],
	directions: string[],
	tags: string[],
	description: string,
	// extra notes about some step/ingredient, accompanied
	// by a star (*) to indicate that it's a note in the source text
	notes: string[],
	// name of original author, or website URL preferred
	// if none found, leave undefined or do not include
	attribution: string | undefined,
}`;

export async function textToRecipe(text: string) {
	const response = await client.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content: text },
		],
		response_format: { type: 'json_object' },
	});

	const rawRecipe = JSON.parse(response.choices[0].message.content!);
	console.log(rawRecipe);
	const recipe = Recipe.safeParse(rawRecipe);

	return recipe.success ? recipe.data : null;
}

