<script lang="ts">
	import { t } from '$lib/translations';

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
			name: $t('label.calories'),
			key: 'calories',
			colour: 'bg-emerald-500',
		},
		{
			name: $t('label.fat'),
			key: 'fat',
			colour: 'bg-yellow-500',
		},
		{
			name: $t('label.saturated-fat'),
			key: 'saturatedFat',
			colour: 'bg-amber-500',
		},
		{
			name: $t('label.protein'),
			key: 'protein',
			colour: 'bg-red-400',
		},
		{
			name: $t('label.sugar'),
			key: 'sugar',
			colour: 'bg-blue-500',
		},
		{
			name: $t('label.sodium'),
			key: 'sodium',
			colour: 'bg-neutral-600',
		},
	] as Nutrition[];
</script>

<div class="grid gap-2">
	<div class="w-full rounded-xl overflow-hidden h-16 flex flex-row">
		{#each nutrition as { colour, name, key } (name)}
			{#if key !== 'calories'}
				<div class="h-full {colour}" style="width: {recipe[key]}%" />
			{/if}
		{/each}

		<div class="h-full bg-base-300 flex-grow" />
	</div>

	{#if enableEditing}
		<div class="table border-separate border-spacing-y-2">
			{#each nutrition as stat (stat.name)}
				<div class="join table-row">
					<div class="join-item w-10 {stat.colour} table-cell" />

					<div
						class="join-item bg-base-300 text-sm md:text-md lg:text-lg px-2 table-cell"
					>
						{stat.name}
					</div>

					<div class="bg-base-200 h-full">
						<input
							class="input bg-base-200 font-mono join-item flex-grow table-cell py-7"
							type="number"
							value={recipe[stat.key]}
							on:input={e => {
								recipe[stat.key] = e.currentTarget.valueAsNumber;
							}}
						/>
					</div>

					<span
						class="bg-base-300 join-item px-2 line-clamp-1 text-xs md:text-sm lg:text-md table-cell"
					>
						{#if stat.key === 'calories'}
							/ 100g
						{:else}
							g / 100g
						{/if}
					</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="w-full flex flex-row flex-wrap gap-4">
			{#each nutrition as { name, colour, key } (name)}
				{#if key !== 'calories'}
					<div class="flex flex-row place-items-center gap-2">
						<div class="w-8 h-8 rounded-full {colour}" />

						<span class="text-sm">{name}</span>
					</div>
				{/if}
			{/each}

			<div class="flex flex-row place-items-center gap-2">
				<div class="w-8 h-8 rounded-full bg-base-300" />

				<span class="text-sm">
					{$t('label.other')}
				</span>
			</div>
		</div>
	{/if}
</div>
