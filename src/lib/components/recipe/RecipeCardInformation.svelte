<script lang="ts">
	import Verified from '~icons/ic/baseline-verified';
	import type { PartialRecipe } from '$lib/server/schema';
	import { locale, t } from '$lib/translations';
	import type { Size } from '$lib/types';
	import { formatRelativeTime } from '$lib/util';

	export let recipe: PartialRecipe | undefined = undefined;
	export let title: boolean = true;
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
		{#if title}
			<h1
				class="line-clamp-2 font-bold text-neutral-800 dark:text-neutral-200"
				style="font-size: {sizes[size]}rem;"
			>
				{@html recipe.title}
			</h1>
		{/if}

		<div class="text-sm flex flex-col gap-1">
			<a
				class="flex flex-row place-items-center gap-1 no-underline"
				href="/@{recipe.author.username}"
			>
				@{recipe.author.username}

				{#if recipe.author.verified}
					<span class="text-info"><Verified /></span>
				{/if}
			</a>

			<div class="flex flex-row gap-2 place-items-center">
				<span>
					{$t('stat.views', {
						views: recipe.views ?? 0,
					})}
				</span>
				<span class="text-neutral-500">•</span>
				<span>
					{formatRelativeTime($locale, new Date(recipe.createdAt))}
				</span>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col w-full gap-2">
		{#if title}
			<div
				class="skeleton max-w-full w-full"
				style="width: {Math.floor(Math.random() * 100 + 150)}px; height: {sizes[
					size
				] + 0.5}rem;"
			/>
		{/if}

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
