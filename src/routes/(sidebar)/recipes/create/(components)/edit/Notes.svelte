<script lang="ts">
	import { t } from '$lib/translations';

	import type { Recipe } from '.';

	export let recipe: Recipe;
</script>

<textarea
	class="bg-base-300 rounded-lg text-lg lg:text-2xl p-2 min-h-48"
	placeholder={$t('placeholder.add-notes')}
	bind:value={recipe.notes}
/>
