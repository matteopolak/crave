<script lang="ts">
	export let salt: number;
	export let energy: number;
	export let fat: number;
	export let saturated: number;
	export let protein: number;
	export let sugar: number;

	$: sodium = salt * 0.38758;
	$: calories = energy * 0.239006;

	$: nutrition = [
		{
			name: 'Calories',
			value: calories,
			colour: 'bg-emerald-500',
		},
		{
			name: 'Fat',
			value: fat,
			colour: 'bg-yellow-500',
		},
		{
			name: 'Saturated Fat',
			value: saturated,
			colour: 'bg-amber-500',
		},
		{
			name: 'Protein',
			value: protein,
			colour: 'bg-red-400',
		},
		{
			name: 'Sugar',
			value: sugar,
			colour: 'bg-blue-500',
		},
		{
			name: 'Sodium',
			value: sodium,
			colour: 'bg-neutral-600',
		},
		{
			name: 'Other',
			value: 100,
			colour: 'bg-base-300',
		},
	];
</script>

<div class="grid gap-2">
	<div class="w-full rounded-xl overflow-hidden h-16 flex flex-row">
		{#each nutrition as { value, colour }}
			<div class="h-full {colour}" style="width: {value}%" />
		{/each}
	</div>

	<div class="w-full flex flex-row flex-wrap gap-4">
		{#each nutrition as { name, colour }}
			<div class="flex flex-row place-items-center gap-2">
				<div class="w-8 h-8 rounded-full {colour}" />

				<span class="text-sm">{name}</span>
			</div>
		{/each}
	</div>
</div>
