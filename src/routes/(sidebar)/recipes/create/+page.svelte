<script lang="ts" context="module">
	import type { Router } from '$lib/server/routes';
	import type { inferRouterInputs } from '@trpc/server';

	export type Recipe = inferRouterInputs<Router>['recipes']['create'];
</script>

<script lang="ts">
	import toast from 'svelte-french-toast';
	import { resolveRoute } from '$app/paths';

	import Page0 from './(components)/Page0.svelte';
	import Page1 from './(components)/Page1.svelte';
	import Page2 from './(components)/Page2.svelte';
	import Page3 from './(components)/Page3.svelte';

	import Back from '~icons/ic/baseline-arrow-back';
	import Forward from '~icons/ic/baseline-arrow-forward';
	import { trpc } from '$lib/client';
	import { goto } from '$app/navigation';
	import { TRPCClientError } from '@trpc/client';

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

	const pages = [
		{
			name: 'Thumbnail and title',
			component: Page0,
		},
		{
			name: 'Ingredients',
			component: Page1,
		},
		{
			name: 'Directions',
			component: Page2,
		},
		{
			name: 'Nutritional information',
			component: Page3,
		},
	];

	async function resize(data: string) {
		const canvas = document.createElement('canvas');

		const img = new Image();
		img.src = recipe.thumbnail;

		await new Promise<void>(resolve => {
			img.onload = () => {
				const { width, height } = img;

				const max = Math.max(width, height);

				canvas.width = (width / max) * 512;
				canvas.height = (height / max) * 512;

				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				resolve();
			};
		});

		return canvas.toDataURL('image/jpeg', 0.8);
	}

	async function submit() {
		recipe.thumbnail = await resize(recipe.thumbnail);

		try {
			const { id } = await toast.promise(
				trpc.recipes.create.mutate(recipe),
				{
					loading: 'Creating recipe...',
					success: 'Recipe created!',
					error: e => {
						if (e instanceof TRPCClientError) {
							return JSON.parse(e.message)[0].message;
						} else {
							return 'An unknown error occurred.';
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
					Submit
				</button>
			{/if}
		</div>
	</div>
</div>
