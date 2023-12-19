<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import type { Size } from '$lib/types';
	import { showOnLoad } from '$lib/util';
	import RecipeCardInformation from './RecipeCardInformation.svelte';

	export let recipe: PartialRecipe | undefined = undefined;

	export let size: Size = '3xl';
	export let author = false;
	export let side = false;

	const sizes: Record<Size, string> = {
		sm: '24rem',
		md: '28rem',
		lg: '32rem',
		xl: '36rem',
		'2xl': '40rem',
		'3xl': '44rem',
		'4xl': '48rem',
		'5xl': '52rem',
		'6xl': '56rem',
		'7xl': '60rem',
		full: '100%',
	};
</script>

{#if recipe}
	<a
		class="h-full flex gap-3 w-full group"
		class:flex-row={side}
		class:flex-col={!side}
		href="/recipes/{recipe.id}"
	>
		<div
			class="rounded-lg overflow-hidden aspect-video bg-base-300"
			style="width: {sizes[size]};"
		>
			<img
				class="object-cover rounded-lg h-full w-full group-hover:scale-105 transition-all duration-300"
				src={recipe.thumbnail}
				alt={recipe.title}
				use:showOnLoad
			/>
		</div>

		<div class="flex flex-row gap-2 w-full">
			{#if author}
				<img
					src="https://via.placeholder.com/64"
					class="rounded-full w-8 h-8"
					alt={recipe.author.name}
					use:showOnLoad
				/>
			{/if}

			<RecipeCardInformation {recipe} {size} />
		</div>
	</a>
{:else}
	<div
		class="h-full flex gap-3 w-full"
		class:flex-row={side}
		class:flex-col={!side}
	>
		<div
			class="rounded-lg aspect-video skeleton h-full"
			style="width: {sizes[size]};"
		/>

		<div class="flex flex-row gap-2 w-full">
			{#if author}
				<div class="skeleton rounded-full w-8 h-8" />
			{/if}

			<RecipeCardInformation {size} />
		</div>
	</div>
{/if}
