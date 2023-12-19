<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import { showOnLoad } from '$lib/util';
	import RecipeCardInformation from './RecipeCardInformation.svelte';

	export let recipe: PartialRecipe | undefined = undefined;
</script>

{#if recipe}
	<a
		class="w-full h-full flex flex-row gap-4 group"
		href="/recipes/{recipe.id}"
	>
		<div
			class="rounded-lg overflow-hidden aspect-video h-full w-32 lg:w-40 xl:w-48 bg-base-300"
		>
			<img
				class="object-cover rounded-lg h-full w-full group-hover:scale-105 transition-all duration-300"
				src={recipe.thumbnail}
				alt={recipe.title}
				use:showOnLoad
			/>
		</div>

		<RecipeCardInformation {recipe} />
	</a>
{:else}
	<div class="w-full h-full flex flex-row gap-4">
		<div class="rounded-lg aspect-video h-full w-32 lg:w-40 xl:w-48 skeleton" />

		<RecipeCardInformation />
	</div>
{/if}
