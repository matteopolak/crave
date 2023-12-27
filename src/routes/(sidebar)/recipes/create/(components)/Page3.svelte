<script lang="ts">
	import NutritionFacts from '$lib/components/recipe/NutritionFacts.svelte';
	
	import type { Recipe } from '../+page.svelte';

	export let recipe: Recipe;
</script>

<NutritionFacts bind:recipe enableEditing />
