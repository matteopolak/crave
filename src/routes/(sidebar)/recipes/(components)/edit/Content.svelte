<script lang="ts">
	import AddPhoto from '~icons/ic/baseline-add-photo-alternate';
	import Upload from '~icons/ic/baseline-cloud-upload';
	import { t } from '$lib/translations';

	import type { Recipe } from '.';

	export let recipe: Recipe;

	let tag = '';
	let files: FileList;
	let input: HTMLInputElement;
	let hovering = false;

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
	class="bg-base-300 rounded-2xl aspect-video flex place-items-center justify-center relative w-full h-full"
	on:click={() => input.click()}
	on:dragover|preventDefault={() => {}}
	on:drop|preventDefault={(e) => {
		if (e.dataTransfer) files = e.dataTransfer.files;
		hovering = false;
	}}
	on:dragenter|preventDefault={() => {
		hovering = true;
	}}
	on:dragleave|preventDefault={() => {
		hovering = false;
	}}
>
	<div
		class="w-full h-full absolute top-0 left-0 rounded-2xl opacity-75 transition-all duration-300 border-primary"
		class:border-8={hovering}
	/>

	{#if recipe.thumbnail}
		<img
			class="object-cover rounded-2xl w-full h-full m-0"
			src={recipe.thumbnail}
			alt={recipe.title}
		/>
	{:else if hovering}
		<span>{$t('label.drop-to-upload')} <Upload class="inline-block"/></span>
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

<div class="flex flex-row flex-wrap gap-1">
	{#each recipe.tags as tag, index}
		<button
			class="badge badge-lg h-10 badge-neutral line-clamp-1"
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
			class="badge badge-lg h-10 bg-base-300"
			placeholder={$t('placeholder.add-tag')}
			bind:value={tag}
		/>
	</form>
</div>

<input
	class="bg-base-300 rounded-lg text-xl lg:text-4xl font-extrabold p-2"
	placeholder={$t('placeholder.add-title')}
	type="text"
	bind:value={recipe.title}
/>

<textarea
	class="bg-base-300 rounded-lg text-lg lg:text-2xl p-2 min-h-48"
	placeholder={$t('placeholder.add-description')}
	bind:value={recipe.description}
/>
