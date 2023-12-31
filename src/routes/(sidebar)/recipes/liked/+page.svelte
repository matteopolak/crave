<script lang="ts">
	import { trpc } from '$lib/client';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';
	import { t } from '$lib/translations';
</script>

<div class="max-w-4xl grid gap-8 px-8 md:px-16 lg:px-24">
	<h1 class="text-4xl font-bold dark:text-neutral-100 text-neutral-800">
		{$t('label.liked-recipes')}
	</h1>

	<RecipeGrid
		recipes={[]}
		side
		vertical
		size="xl"
		itemThreshold={25}
		placeholderItems={10}
		load={i =>
			trpc.recipes.liked.query({
				page: i,
			})}
	/>
</div>
