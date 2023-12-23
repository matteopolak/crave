<script lang="ts">
	type Recipe = {
		calories: number;
		fat: number;
		saturatedFat: number;
		protein: number;
		sugar: number;
		sodium: number;
	};

	export let recipe: Recipe;
	export let enableEditing = false;

	type Nutrition = {
		name: string;
		key: keyof Recipe;
		colour: string;
	};

	$: nutrition = [
		{
			name: 'Calories',
			key: 'calories',
			colour: 'bg-emerald-500',
		},
		{
			name: 'Fat',
			key: 'fat',
			colour: 'bg-yellow-500',
		},
		{
			name: 'Saturated Fat',
			key: 'saturatedFat',
			colour: 'bg-amber-500',
		},
		{
			name: 'Protein',
			key: 'protein',
			colour: 'bg-red-400',
		},
		{
			name: 'Sugar',
			key: 'sugar',
			colour: 'bg-blue-500',
		},
		{
			name: 'Sodium',
			key: 'sodium',
			colour: 'bg-neutral-600',
		},
	] as Nutrition[];
</script>

<div class="grid gap-2">
	<div class="w-full rounded-xl overflow-hidden h-16 flex flex-row">
		{#each nutrition as { colour, name, key } (name)}
			<div class="h-full {colour}" style="width: {recipe[key]}%" />
		{/each}

		<div class="h-full bg-base-300 flex-grow" />
	</div>

	{#if enableEditing}
		<table>
			{#each nutrition as stat (stat.name)}
				<tr>
					<td>
						<div class="w-8 h-8 rounded-full {stat.colour} inline-block" />
					</td>

					<td>
						<span class="text-sm md:text-md lg:text-lg place-self-center"
							>{stat.name}</span
						>
					</td>

					<td>
						<input
							class="input font-mono flex-grow w-32 md:w-40 lg:w-64"
							type="number"
							value={recipe[stat.key]}
							on:input={e => {
								recipe[stat.key] = e.currentTarget.valueAsNumber;
							}}
						/>

						<span class="text-sm md:text-md lg:text-lg">g / 100g</span>
					</td>
				</tr>
			{/each}
		</table>
	{:else}
		<div class="w-full flex flex-row flex-wrap gap-4">
			{#each nutrition as { name, colour } (name)}
				<div class="flex flex-row place-items-center gap-2">
					<div class="w-8 h-8 rounded-full {colour}" />

					<span class="text-sm">{name}</span>
				</div>
			{/each}

			<div class="flex flex-row place-items-center gap-2">
				<div class="w-8 h-8 rounded-full bg-base-300" />

				<span class="text-sm">Other</span>
			</div>
		</div>
	{/if}
</div>
