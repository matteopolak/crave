<script lang="ts">
	import Unlike from '~icons/ic/baseline-favorite';
	import Like from '~icons/ic/baseline-favorite-border';
	import { trpc } from '$lib/client';
	import type { Recipe } from '$lib/server/schema';
	import { formatNumber } from '$lib/util';

	export let recipe: Recipe;

	async function toggle() {
		recipe.liked = !recipe.liked;
		recipe.likes += recipe.liked ? 1 : -1;
		recipe = recipe;

		await trpc.recipes[recipe.liked ? 'like' : 'unlike'].mutate({
			id: recipe.id,
		});
	}
</script>

<button on:click={toggle} class="btn">
	<span class="text-red-500">
		{#if recipe.liked}
			<Unlike class="w-6 h-6" />
		{:else}
			<Like class="w-6 h-6" />
		{/if}
	</span>

	<span class="text-lg w-8">
		{formatNumber(recipe.likes)}
	</span>
</button>
