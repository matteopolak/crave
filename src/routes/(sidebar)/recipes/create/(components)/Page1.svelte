<script lang="ts">
	import { tick } from 'svelte';

	import Add from '~icons/ic/baseline-add';
	import Delete from '~icons/ic/baseline-delete';
	import { t } from '$lib/translations';
	
	import type { Recipe } from '../+page.svelte';

	export let recipe: Recipe;

	const inputs = [] as HTMLInputElement[];
</script>

<h2>{$t('label.ingredients')}</h2>

<form
	class="flex flex-col gap-2"
	on:submit|preventDefault={() => {
		recipe.ingredients.push('');
		recipe = recipe;

		tick().then(() => {
			inputs.at(-1)?.focus();
		});
	}}
>
	{#each recipe.ingredients as ingredient, index}
		<div class="relative join">
			<input
				type="text"
				class="input input-bordered bg-base-300 border-none w-full join-item"
				bind:value={ingredient}
				bind:this={inputs[index]}
			/>

			<button
				class="btn btn-neutral join-item"
				type="button"
				on:click={() => {
					recipe.ingredients.splice(index, 1);
					recipe = recipe;
				}}
			>
				<Delete />
			</button>
		</div>
	{/each}

	<button class="btn bg-base-300 justify-start" type="submit">
		<Add />
		{$t('label.add-ingredient')}
	</button>
</form>
