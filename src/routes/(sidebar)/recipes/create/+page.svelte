<script lang="ts" context="module">
	import type { Router } from '$lib/server/routes';
	import type { inferRouterInputs } from '@trpc/server';

	export type Recipe = inferRouterInputs<Router>['recipes']['create'];
</script>

<script lang="ts">
	import { TRPCClientError } from '@trpc/client';
	import toast from 'svelte-french-toast';

	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { trpc } from '$lib/client';
	import { resize } from '$lib/util';
	import { t } from '$lib/translations';

	import Page0 from './(components)/Page0.svelte';
	import Page1 from './(components)/Page1.svelte';
	import Page2 from './(components)/Page2.svelte';
	import Page3 from './(components)/Page3.svelte';

	import Back from '~icons/ic/baseline-arrow-back';
	import Forward from '~icons/ic/baseline-arrow-forward';

	let recipe = {
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
	} as Recipe;

	let page = 0;

	$: pages = [
		{
			name: $t('label.thumbnail-and-title'),
			component: Page0,
		},
		{
			name: $t('label.ingredients'),
			component: Page1,
		},
		{
			name: $t('label.directions'),
			component: Page2,
		},
		{
			name: $t('label.nutritional-information'),
			component: Page3,
		},
	];

	async function submit() {
		recipe.thumbnail = await resize(recipe.thumbnail);

		try {
			const { id } = await toast.promise(
				trpc.recipes.create.mutate(recipe),
				{
					loading: $t('toast.create-recipe-loading'),
					success: $t('toast.create-recipe-done'),
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
		} catch {}
	}
</script>

<div class="flex flex-col items-center h-full">
	<div class="grid max-w-4xl w-full gap-2 h-full prose prose-h2:m-0">
		<div class="flex flex-col gap-4">
			<svelte:component this={pages[page].component} bind:recipe />
		</div>

		<div class="flex flex-row flex-wrap mt-auto">
			{#if page > 0}
				<button class="btn btn-accent mr-auto" on:click={() => page--}>
					<Back />
					{pages[page - 1].name}
				</button>
			{/if}

			{#if page < pages.length - 1}
				<button class="btn btn-accent ml-auto" on:click={() => page++}>
					{pages[page + 1].name}
					<Forward />
				</button>
			{:else}
				<button class="btn btn-secondary ml-auto" on:click={submit}>
					{$t('label.submit')}
				</button>
			{/if}
		</div>
	</div>
</div>
