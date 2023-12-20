<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import type { Size } from '$lib/types';
	import Time from 'svelte-time';
	import Verified from '~icons/ic/baseline-verified';

	export let recipe: PartialRecipe | undefined = undefined;
	export let size: Size = 'md';

	const sizes: Record<Size, number> = {
		sm: 0.875,
		md: 1,
		lg: 1.25,
		xl: 1.5,
		'2xl': 2,
		'3xl': 2.5,
		'4xl': 2.5,
		'5xl': 2.5,
		'6xl': 2.5,
		'7xl': 2.5,
		full: 1,
	};
</script>

{#if recipe}
	<div class="flex flex-col w-full gap-1">
		<h1
			class="line-clamp-2 font-bold text-neutral-800 dark:text-neutral-200"
			style="font-size: {sizes[size]}rem;"
		>
			{recipe.title}
		</h1>

		<div class="text-sm flex flex-col gap-1">
			<span class="flex flex-row place-items-center gap-1">
				@{recipe.author.username}

				{#if recipe.author.username === 'crave'}
					<span class="text-info"><Verified /></span>
				{/if}
			</span>

			<div class="flex flex-row gap-2 place-items-center">
				<span>{recipe.views} views</span>
				<span class="text-neutral-500">•</span>
				<span><Time timestamp={recipe.createdAt} relative /></span>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col w-full gap-2">
		<div
			class="skeleton max-w-full w-full"
			style="width: {Math.floor(Math.random() * 100 + 150)}px; height: {sizes[
				size
			] + 0.5}rem;"
		/>

		<div class="flex flex-col gap-1">
			<div
				class="skeleton max-w-full h-4 w-full"
				style="width: {Math.floor(Math.random() * 100 + 100)}px"
			/>

			<div
				class="skeleton max-w-full h-4 w-full"
				style="width: {Math.floor(Math.random() * 100 + 100)}px"
			/>
		</div>
	</div>
{/if}
