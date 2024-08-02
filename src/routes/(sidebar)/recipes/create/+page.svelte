<script lang="ts">
	import { trpc } from '$lib/client';
	import { t } from '$lib/translations';

	import type { Recipe } from './(components)/edit';
	import EditRecipe from './(components)/EditRecipe.svelte';

	let content = '';
	let recipe: Recipe | null = null;
	let loading = false;

	async function submit() {
		if (loading) return;

		loading = true;
		recipe = await trpc.recipes.parse.mutate({ text: content });
		loading = false;
	}

	function enableManualEntry() {
		recipe = {
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
			url: '',
		};
	}
</script>

{#if recipe}
	<EditRecipe {recipe} />
{:else}
	<div class="flex flex-col items-center h-full">
		<div class="grid max-w-4xl w-full gap-8 prose prose-h2:m-0 prose-p:m-0">
			<button class="btn btn-accent ml-auto" on:click={enableManualEntry}>
				{$t('label.enter-manually')}
			</button>

			<section>
				<h1>Creating a new recipe</h1>
				<ul>
					<li>
						Copy-and-paste the full recipe content (including the author) below
					</li>
					<li>Click the "Generate Recipe" button</li>
					<li>Review the generated recipe and edit if needed</li>
					<li>Click the "Submit" button</li>
					<li class="font-bold">
						Or if it's a hardcopy, you can enter the recipe manually by clicking
						the "Enter manually" button above
					</li>
				</ul>
			</section>

			<textarea
				class="bg-base-300 rounded-lg text-lg lg:text-2xl p-2 min-h-48"
				placeholder={$t('placeholder.recipe-content')}
				bind:value={content}
			/>

			<div class="flex flex-row flex-wrap mt-auto">
				<button class="btn btn-secondary ml-auto" on:click={submit}>
					{#if loading}
						<span class="loading loading-spinner" />
					{/if}
					{$t('label.generate-recipe')}
				</button>
			</div>
		</div>
	</div>
{/if}
