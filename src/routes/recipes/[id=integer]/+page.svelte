<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import Recipe from '../(components)/Recipe.svelte';
	import RecipeSideCard from '../(components)/RecipeSideCard.svelte';

	import Food from '~icons/emojione/pot-of-food';

	$: result = createQuery({
		queryKey: ['recipe'],
		queryFn: () =>
			Promise.all([
				trpc.get.query({
					id: parseInt($page.params.id),
				}),
				trpc.similar.query({
					id: parseInt($page.params.id),
				}),
			]),
	});
</script>

<div
	class="flex flex-col md:flex-row gap-8 pt-8 pb-16 pr-12 lg:pr-16 xl:pr-32 pl-8"
>
	{#if $result.isPending}
		<Recipe />

		<div>
			<div class="flex flex-col gap-2">
				{#each { length: 10 } as _}
					<RecipeSideCard />
				{/each}
			</div>
		</div>
	{:else if $result.isError}
		<div class="flex w-full h-full justify-center mt-40">
			<div class="grid place-items-center max-w-xl gap-16">
				<Food class="w-2/3 h-auto" />
				<span class="text-neutral-100 text-2xl">
					This recipe isn't available anymore.
				</span>
			</div>
		</div>
	{:else}
		<Recipe recipe={$result.data[0]} />

		<div>
			<div class="flex flex-col gap-2">
				{#each $result.data[1] as recipe}
					<RecipeSideCard {recipe} />
				{/each}
			</div>
		</div>
	{/if}
</div>
