<script lang="ts">
	export let salt: number;
	export let energy: number;
	export let fat: number;
	export let saturated: number;
	export let protein: number;
	export let sugar: number;

	$: sodium = salt * 0.38758;
</script>

<section
	class="border-base-content border-[1px] m-5 float-left w-72 p-2 font-sans"
>
	<header>
		<h1 class="font-bold text-[2rem] mb-1">Nutrition Facts</h1>
		<p class="m-0">Per 3/4 cup (100g)</p>
	</header>

	<table>
		<tbody>
			<tr>
				<th colspan="2">
					<b>Calories {Math.round(energy / 10) * 10}</b>
				</th>
				<td colspan="5" class="small-info text-right">
					<b>% Daily Value</b>
				</td>
			</tr>
			<tr class="thick-row">
				<th colspan="4">
					<b>Total Fat</b>
					{Math.round(fat + saturated)}g
				</th>
				<td class="text-right">
					<b>{Math.round(((fat + saturated) / 78) * 100)}%</b>
				</td>
			</tr>
			<tr>
				<td class="blank-cell"> </td>
				<th colspan="3"> Saturated Fat {Math.round(saturated)}g </th>
				<td class="text-right">
					<b>{Math.round((saturated / 26) * 100)}%</b>
				</td>
			</tr>
			<tr>
				<th colspan="4">
					<b>Sodium</b>
					{Math.round(sodium)}mg
				</th>
				<td class="text-right" colspan="1">
					<b>{Math.round((sodium / 2_300) * 100)}%</b>
				</td>
			</tr>
			<tr>
				<th colspan="4">
					<b>Total Carbohydrate</b>
					{Math.round(sugar)}g
				</th>
				<td class="text-right">
					<b>{Math.round(sugar)}%</b>
				</td>
			</tr>
			<tr>
				<td class="blank-cell"> </td>
				<th colspan="3"> Sugars {Math.round(sugar)}g </th>
				<td> </td>
			</tr>
			<tr>
				<th colspan="4">
					<b>Protein</b>
					{Math.round(protein)}g
				</th>
				<td> </td>
			</tr>
		</tbody>
	</table>
</section>

<style>
	p {
		margin: 0;
	}

	table {
		@apply m-0;

		& thead tr {
			& th,
			td {
				border: 0;
			}
		}

		& th,
		td {
			font-weight: normal;
			padding: 0.25rem 0;

			@apply border-base-content border-t-[1px];
		}

		& tr {
			& :last-child {
				text-align: right;
			}
		}

		& .blank-cell {
			width: 1rem;
			border-top: 0;
		}

		& .thick-row {
			& th,
			td {
				border-top-width: 5px;
			}
		}
	}

	.small-info {
		font-size: 0.7rem;
	}
</style>
