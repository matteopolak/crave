<script lang="ts">
	import type { Recipe } from '../+page.svelte';

	import NutritionFacts from '$lib/components/recipe/NutritionFacts.svelte';

	export let recipe: Recipe;
</script>

<NutritionFacts bind:recipe enableEditing />
