<script lang="ts">
	import type { User } from 'lucia';

	import { PUBLIC_FALLBACK_AVATAR_URL } from '$env/static/public';
	import type { Recipe } from '$lib/server/schema';
	import { t } from '$lib/translations';
	import { showOnLoad } from '$lib/util';

	import Subscribe from '../Subscribe.svelte';
	import Like from './Like.svelte';
	import NutritionFacts from './NutritionFacts.svelte';
	import RecipeCardInformation from './RecipeCardInformation.svelte';

	export let recipe: Recipe | undefined = undefined;
	export let user: User | undefined;
</script>

<div class="w-full">
	<div class="prose max-w-full">
		{#if recipe}
			<div class="bg-base-300 rounded-2xl aspect-video">
				<img
					class="object-cover w-full h-full rounded-2xl mt-0"
					src={recipe.thumbnail}
					alt={recipe.title}
					use:showOnLoad
				/>
			</div>

			<div class="flex flex-row flex-wrap place-items-center pb-2">
				<a
					href="/@{recipe.author.username}"
					class="flex flex-row gap-2 place-items-center w-fit no-underline"
				>
					<img
						src={recipe.author.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL}
						class="rounded-full w-14 h-14"
						alt={recipe.author.name}
						use:showOnLoad
					/>

					<RecipeCardInformation {recipe} title={false} size="lg" />
				</a>

				<div class="ml-auto w-fit flex flex-row place-items-center gap-2">
					{#if user && user.userId === recipe.author.id}
						<a
							href="/recipes/{recipe.id}/edit"
							class="btn btn-accent no-underline text-accent-content"
						>
							{$t('label.edit')}
						</a>
					{/if}

					{#if user && user.userId !== recipe.author.id}
						<Subscribe bind:user={recipe.author} />
					{/if}

					<Like bind:recipe />
				</div>
			</div>

			<div>
				<div class="flex flex-row flex-wrap gap-1 mt-7">
					{#each recipe.tags as tag}
						<div class="badge badge-lg badge-neutral line-clamp-1">
							{@html tag}
						</div>
					{/each}
				</div>

				<h1 class="mt-4">{@html recipe.title}</h1>
			</div>

			{#if recipe.description}
				<p class="mt-10">
					{@html recipe.description}
				</p>
			{/if}

			<NutritionFacts {recipe} />

			<h2>
				{$t('label.ingredients')}
			</h2>

			<ul>
				{#each recipe.ingredients as ingredient}
					<li>{@html ingredient}</li>
				{/each}
			</ul>

			<h2>
				{$t('label.directions')}
			</h2>

			<ol>
				{#each recipe.directions as direction}
					<li>
						{@html direction}
					</li>
				{/each}
			</ol>

			{#if recipe.notes}
				<h2>
					{$t('label.notes')}
				</h2>

				<p>
					{@html recipe.notes}
				</p>
			{/if}
		{:else}
			<div class="w-full h-full aspect-video skeleton" />

			<div class="flex flex-row flex-wrap gap-1 mt-7">
				{#each { length: 5 } as _}
					<div
						class="badge badge-sm skeleton h-6 max-w-full"
						style="width: {Math.floor(Math.random() * 70 + 50)}px"
					/>
				{/each}
			</div>

			<div
				class="skeleton max-w-full h-12 mt-4"
				style="width: {Math.floor(Math.random() * 200 + 550)}px"
			/>

			<div class="skeleton max-w-full h-8 mt-10 w-96" />

			<div class="flex flex-col gap-2 mt-8">
				{#each { length: 5 } as _}
					<div
						class="h-6 skeleton max-w-full"
						style="width: {Math.floor(Math.random() * 400 + 300)}px"
					/>
				{/each}
			</div>

			<div class="skeleton max-w-full h-8 mt-10 w-96" />

			<div class="flex flex-col gap-2 mt-8">
				{#each { length: 5 } as _}
					<div
						class="h-6 skeleton max-w-full"
						style="width: {Math.floor(Math.random() * 400 + 300)}px"
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
