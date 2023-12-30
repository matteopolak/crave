<script lang="ts">
	import { tick } from 'svelte';

	import Add from '~icons/ic/baseline-add';
	import Delete from '~icons/ic/baseline-delete';
	import { t } from '$lib/translations';

	import type { Recipe } from '.';

	export let recipe: Recipe;

	const inputs = [] as HTMLInputElement[];
</script>

<h2>{$t('label.ingredients')}</h2>

<div class="flex flex-col gap-2">
	{#each recipe.ingredients as ingredient, index}
		<form
			class="relative join"
			on:submit|preventDefault={() => {
				// push after cirremt index
				recipe.ingredients.splice(index + 1, 0, '');
				recipe = recipe;

				tick().then(() => {
					inputs.at(index + 1)?.focus();
				});
			}}
		>
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
		</form>
	{/each}

	<button class="btn bg-base-300 justify-start" type="submit">
		<Add />
		{$t('label.add-ingredient')}
	</button>
</div>
