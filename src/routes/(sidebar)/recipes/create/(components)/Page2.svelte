<script lang="ts">
	import { tick } from 'svelte';

	import type { Recipe } from '../+page.svelte';

	import Add from '~icons/ic/baseline-add';
	import Delete from '~icons/ic/baseline-delete';

	export let recipe: Recipe;

	const inputs = [] as HTMLInputElement[];
</script>

<h2>Directions</h2>

<form
	class="flex flex-col gap-2"
	on:submit|preventDefault={() => {
		recipe.directions.push('');
		recipe = recipe;

		tick().then(() => {
			inputs.at(-1)?.focus();
		});
	}}
>
	{#each recipe.directions as direction, index}
		<div class="relative join">
			<input
				type="text"
				class="input input-bordered bg-base-300 border-none w-full join-item"
				bind:value={direction}
				bind:this={inputs[index]}
			/>

			<button
				class="btn btn-neutral join-item"
				type="button"
				on:click={() => {
					recipe.directions.splice(index, 1);
					recipe = recipe;
				}}
			>
				<Delete />
			</button>
		</div>
	{/each}

	<button class="btn bg-base-300 justify-start" type="submit">
		<Add />
		Add direction...
	</button>
</form>
