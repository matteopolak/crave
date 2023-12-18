<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import { showOnLoad } from '$lib/util';
	import Time from 'svelte-time';
	import Verified from '~icons/ic/baseline-verified';

	export let recipe: PartialRecipe | undefined = undefined;
</script>

{#if recipe}
	<a
		class="h-full flex flex-col gap-3 w-full group"
		href="/recipes/{recipe.id}"
	>
		<div class="rounded-lg overflow-hidden aspect-video w-full bg-base-300">
			<img
				class="object-cover rounded-lg h-full w-full group-hover:scale-105 transition-all duration-300"
				src={recipe.thumbnail}
				alt={recipe.title}
				use:showOnLoad
			/>
		</div>

		<div class="flex flex-row gap-2">
			<img
				src="https://via.placeholder.com/64"
				class="rounded-full w-8 h-8"
				alt={recipe.author.name}
				use:showOnLoad
			/>

			<div class="flex flex-col gap-1">
				<h1
					class="line-clamp-2 font-bold text-neutral-800 dark:text-neutral-200"
				>
					{recipe.title}
				</h1>

				<div class="text-sm">
					<span class="flex flex-row place-items-center gap-1">
						@{recipe.author.username}
						{#if recipe.author.username === 'system'}
							<span class="text-info"><Verified /></span>
						{/if}
					</span>

					<div class="flex flex-row gap-2 place-items-center">
						<span>{recipe.views} views</span>
						<span class="text-neutral-500">•</span>
						<span><Time timestamp={recipe.created_at} relative /></span>
					</div>
				</div>
			</div>
		</div>
	</a>
{:else}
	<div class="h-full flex flex-col gap-3 w-full">
		<div class="rounded-lg aspect-video w-full skeleton" />

		<div class="flex flex-row gap-2">
			<div class="skeleton rounded-full w-8 h-8" />

			<div class="flex flex-col gap-1">
				<div
					class="skeleton max-w-full h-6"
					style="width: {Math.floor(Math.random() * 100 + 150)}px"
				/>

				<div
					class="skeleton max-w-full h-4"
					style="width: {Math.floor(Math.random() * 100 + 100)}px"
				/>

				<div
					class="skeleton max-w-full h-4"
					style="width: {Math.floor(Math.random() * 100 + 100)}px"
				/>
			</div>
		</div>
	</div>
{/if}
