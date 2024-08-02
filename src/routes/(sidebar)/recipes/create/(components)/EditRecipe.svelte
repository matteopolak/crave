<script lang="ts">
	import { TRPCClientError } from '@trpc/client';
	import toast from 'svelte-french-toast';

	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { trpc } from '$lib/client';
	import { t } from '$lib/translations';
	import { resize } from '$lib/util';

	import type { Recipe } from './edit';
	import Content from './edit/Content.svelte';
	import Directions from './edit/Directions.svelte';
	import Ingredients from './edit/Ingredients.svelte';
	import Notes from './edit/Notes.svelte';
	import Nutrition from './edit/Nutrition.svelte';

	export let recipe: Recipe;

	async function submit() {
		recipe.thumbnail = recipe.thumbnail && (await resize(recipe.thumbnail));

		try {
			const { id } = await toast.promise(
				trpc.recipes.create.mutate({
					title: recipe.title,
					thumbnail: recipe.thumbnail,
					tags: recipe.tags,
					ingredients: recipe.ingredients,
					directions: recipe.directions,
					calories: recipe.calories,
					fat: recipe.fat,
					saturatedFat: recipe.saturatedFat,
					protein: recipe.protein,
					sodium: recipe.sodium,
					sugar: recipe.sugar,
					notes: recipe.notes || null,
					description: recipe.description || null,
					url: recipe.url,
				}),
				{
					loading: $t('toast.create-recipe-loading'),
					success: $t('toast.create-recipe-done'),
					error: (e) => {
						if (e instanceof TRPCClientError) {
							return e.message;
						} else {
							return $t('error.unknown');
						}
					},
				},
				{
					style:
						'background-color: oklch(var(--b2)); color: oklch(var(--bc) / var(--tw-text-opacity));',
				},
			);

			await goto(resolveRoute('/recipes/[id]', { id: id.toString() }));
		} catch {
			// do nothing
		}
	}
</script>

<div class="flex flex-col items-center h-full">
	<div class="grid max-w-4xl w-full gap-2 h-full prose prose-h2:m-0">
		<div class="flex flex-col gap-16">
			<div class="flex flex-col gap-4">
				<Content bind:recipe />
			</div>
			<div class="flex flex-col gap-4">
				<Ingredients bind:recipe />
			</div>
			<div class="flex flex-col gap-4">
				<Directions bind:recipe />
			</div>
			<div class="flex flex-col gap-4">
				<Notes bind:recipe />
			</div>
			<div class="flex flex-col gap-4">
				<Nutrition bind:recipe />
			</div>
		</div>

		<div class="flex flex-row flex-wrap mt-auto">
			<button class="btn btn-secondary ml-auto" on:click={submit}>
				{$t('label.submit')}
			</button>
		</div>
	</div>
</div>
