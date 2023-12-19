<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import { showOnLoad } from '$lib/util';

	export let recipe: PartialRecipe | undefined = undefined;
</script>

{#if recipe}
	<div
		class="rounded-lg overflow-hidden aspect-square bg-base-300 group relative"
	>
		<img
			class="object-cover h-full w-full rounded-lg group-hover:scale-105 transition-all duration-300"
			src={recipe.thumbnail}
			alt={recipe.title}
			use:showOnLoad
		/>

		<div
			class="opacity-0 group-hover:opacity-100 absolute top-0 left-0 grid place-items-center w-full h-full bg-base-100/[0.5] transition-all duration-300"
		>
			<div
				class="p-8 dark:text-neutral-100 text-neutral-800 font-bold text-sm md:text-lg overflow-hidden"
			>
				<span class="line-clamp-3">{recipe.title}</span>
			</div>
		</div>
	</div>
{:else}
	<div class="rounded-lg aspect-video skeleton" />
{/if}
