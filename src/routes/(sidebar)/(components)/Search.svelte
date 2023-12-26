<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';

	function search() {
		return goto(`/recipes/search?q=${encodeURIComponent(term)}`);
	}

	$: query = createQuery({
		queryKey: ['complete'],
		queryFn: () =>
			term ? trpc.recipes.autocomplete.query({ text: term }) : [],
	});

	$: {
		let self = ++ctx;

		query.subscribe(r => {
			if (self === ctx && r.data) {
				suggestions = r.data;
			}
		});
	}

	let ctx = 0;
	let suggestions: { title: string }[] = [];
	let dropdown: HTMLDivElement;

	let term = $page.url.searchParams.get('q') ?? '';

	$: if (browser) {
		if (term) {
			$page.url.searchParams.set('q', term);
		} else {
			$page.url.searchParams.delete('q');
		}

		history.replaceState(history.state, '', $page.url);
	}
</script>

<form on:submit|preventDefault={search}>
	<div class="dropdown w-full" bind:this={dropdown}>
		<input
			type="text"
			placeholder="Search"
			class="input input-bordered rounded-full bg-base-300 w-full md:w-72 lg:w-96"
			bind:value={term}
			on:focusin={() => dropdown.classList.add('dropdown-open')}
			on:focusout={() => dropdown.classList.remove('dropdown-open')}
		/>

		{#if suggestions.length}
			<ul
				class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-full"
			>
				{#each suggestions as suggestion}
					<li>
						<a href="/recipes/search?q={encodeURIComponent(suggestion.title)}">
							{suggestion.title}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</form>
