<script lang="ts">
	import { trpc } from '$lib/client';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';
</script>

<RecipeGrid
	recipes={[]}
	load={() => trpc.recipes.random.query({})}
	itemThreshold={25}
/>
