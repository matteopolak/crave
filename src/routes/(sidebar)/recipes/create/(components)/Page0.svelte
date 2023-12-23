<script lang="ts">
	import type { Recipe } from '../+page.svelte';
	import AddPhoto from '~icons/ic/baseline-add-photo-alternate';

	export let recipe: Recipe;

	let tag = '';
	let files: FileList;
	let input: HTMLInputElement;

	$: if (files?.length) {
		const file = files[0];
		const reader = new FileReader();

		reader.onload = () => {
			recipe.thumbnail = reader.result as string;
			recipe = recipe;
		};

		reader.readAsDataURL(file);
	}
</script>

<button
	class="bg-base-300 rounded-2xl aspect-video flex place-items-center justify-center relative w-full h-ful"
	on:click={() => input.click()}
>
	{#if recipe.thumbnail}
		<img
			class="object-cover w-full h-full rounded-2xl m-0"
			src={recipe.thumbnail}
			alt={recipe.title}
		/>
	{:else}
		<AddPhoto />
	{/if}

	<input
		type="file"
		class="hidden"
		bind:files
		bind:this={input}
		accept="image/*"
	/>
</button>

<div class="flex flex-row flex-wrap gap-1 mt-7">
	{#each recipe.tags as tag, index}
		<button
			class="badge badge-lg badge-neutral line-clamp-1"
			on:click={() => {
				recipe.tags.splice(index, 1);
				recipe = recipe;
			}}
		>
			{tag}
		</button>
	{/each}

	<form
		on:submit|preventDefault={() => {
			recipe.tags.push(tag);
			recipe = recipe;
			tag = '';
		}}
	>
		<input
			type="text"
			class="bg-transparent"
			placeholder="Add tag..."
			bind:value={tag}
		/>
	</form>
</div>

<input
	class="mt-4 bg-base-300 rounded-lg text-xl lg:text-4xl font-extrabold p-2"
	placeholder="Add a title..."
	type="text"
	bind:value={recipe.title}
/>
