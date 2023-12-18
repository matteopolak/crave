<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';

	import Menu from '~icons/ic/baseline-menu';
	import Logo from '~icons/noto/shallow-pan-of-food';
	import ProfileDropdown from './(components)/ProfileDropdown.svelte';
	import type { PageData } from './$types';

	function search() {
		return goto(`/recipes/search?q=${encodeURIComponent(term)}`);
	}

	$: query = createQuery({
		queryKey: ['complete'],
		queryFn: () => (term ? trpc.complete.query({ text: term }) : []),
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

	export let data: PageData;
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content min-h-screen">
		<div
			class="w-full flex px-4 py-4 items-center sticky top-0 z-10 bg-base-100"
		>
			<div class="flex flex-row items-center gap-2 lg:hidden">
				<label
					for="sidebar"
					class="btn btn-ghost rounded-full drawer-button lg:hidden w-12 h-12 p-0"
				>
					<Menu class="w-6 h-6" />
				</label>

				<a href="/recipes" class="flex flex-row items-center gap-2">
					<Logo class="w-8 h-8" />
					<span
						class="text-neutral-800 dark:text-neutral-100 font-bold text-lg"
					>
						Crave
					</span>
				</a>
			</div>

			<form on:submit|preventDefault={search} class="mx-auto">
				<div class="dropdown w-full" bind:this={dropdown}>
					<input
						type="text"
						placeholder="Search"
						class="input input-bordered rounded-full bg-base-300 w-96"
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
									<a
										href="/recipes/search?q={encodeURIComponent(
											suggestion.title,
										)}"
									>
										{suggestion.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</form>

			<div class="lg:w-64 grid place-items-end">
				<ProfileDropdown username={data.user.username} name={data.user.name} />
			</div>
		</div>

		<slot />
	</div>
	<div class="drawer-side z-20">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay" />

		<ul class="menu p-4 w-64 min-h-full text-base-content bg-base-100">
			<div class="flex flex-row items-center gap-2 lg:p-2 mb-4">
				<label
					for="sidebar"
					class="btn btn-ghost rounded-full drawer-button lg:hidden w-12 h-12 p-0"
				>
					<Menu class="w-6 h-6" />
				</label>

				<a href="/recipes" class="flex flex-row items-center gap-2">
					<Logo class="w-8 h-8" />
					<span
						class="text-neutral-800 dark:text-neutral-100 font-bold text-lg"
					>
						Crave
					</span>
				</a>
			</div>

			<li><a href="/recipes/@me">Your recipes</a></li>

			<div class="divider"></div>

			<li><a href="/recipes/match">Find a recipe</a></li>
		</ul>
	</div>
</div>
