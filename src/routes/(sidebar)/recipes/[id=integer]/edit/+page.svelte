<script lang="ts" context="module">
</script>

<script lang="ts">
	import { TRPCClientError } from '@trpc/client';
	import toast from 'svelte-french-toast';

	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { t } from '$lib/translations';
	import { resize } from '$lib/util';

	import type { Recipe } from '../../(components)/edit';
	import Content from '../../(components)/edit/Content.svelte';
	import Directions from '../../(components)/edit/Directions.svelte';
	import Ingredients from '../../(components)/edit/Ingredients.svelte';
	import Notes from '../../(components)/edit/Notes.svelte';
	import Nutrition from '../../(components)/edit/Nutrition.svelte';

	let recipe = {
		id: 0,
		title: '',
		thumbnail: '',
		tags: [],
		ingredients: [''],
		directions: [''],
		calories: 0,
		fat: 0,
		saturatedFat: 0,
		protein: 0,
		sodium: 0,
		sugar: 0,
		notes: '',
		description: '',
		url: null,
	} as Recipe & { id: number };

	$: {
		getRecipe(parseInt($page.params.id));
	}

	function getRecipe(id: number) {
		trpc.recipes.get
			.query({
				id,
				markdown: true,
			})
			.then(r => {
				recipe = {
					thumbnail: '',
					...r,
				};
			});
	}

	async function submit() {
		recipe.thumbnail = await resize(recipe.thumbnail);

		try {
			const { id } = await toast.promise(
				trpc.recipes.edit.mutate({
					id: recipe.id,
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
					loading: $t('toast.update-recipe-loading'),
					success: $t('toast.update-recipe-done'),
					error: e => {
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
				{$t('label.update')}
			</button>
		</div>
	</div>
</div>
