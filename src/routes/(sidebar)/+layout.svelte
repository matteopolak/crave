<script lang="ts">
	import Menu from '~icons/ic/baseline-menu';
	import Logo from '~icons/noto/shallow-pan-of-food';
	import Channel from '~icons/ic/baseline-account-box';
	import History from '~icons/ic/baseline-history';
	import Liked from '~icons/ic/baseline-favorite';
	import RightArrow from '~icons/ic/baseline-chevron-right';
	import Home from '~icons/ic/baseline-home';
	import Recipes from '~icons/ic/baseline-restaurant-menu';
	import Subscriptions from '~icons/ic/baseline-subscriptions';
	import Settings from '~icons/ic/baseline-settings';
	import Food from '~icons/ic/baseline-fastfood';

	import ProfileDropdown from './(components)/ProfileDropdown.svelte';
	import Search from './(components)/Search.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { trpc } from '$lib/client';
	import type { PageData } from '../$types';

	export let year = new Date().getFullYear();
	export let data: PageData;

	type SidebarCategory = {
		name?: string;
		href?: string;
		disabled?: boolean;
		children: SidebarItem[];
	};

	type SidebarItem = {
		name: string;
		icon: ConstructorOfATypedSvelteComponent | string;
		href: string;
		disabled?: boolean;
	};

	const subscriptions = createQuery({
		queryKey: ['subscriptions'],
		queryFn: () =>
			trpc.users.subscriptions
				.query()
				.then(r => ({ success: true, data: r }) as const)
				.catch(() => ({ success: false }) as const),
	});

	$: sidebar = [
		{
			children: [
				{
					name: 'Home',
					href: '/',
					icon: Home,
				},
				{
					name: 'Recipes',
					href: '/recipes',
					icon: Recipes,
				},
				{
					name: 'Subscriptions',
					href: '/subscriptions',
					icon: Subscriptions,
					disabled: data.user === undefined,
				},
			],
		},
		{
			name: 'You',
			href: `/@${data.user?.username}`,
			disabled: data.user === undefined,
			children: [
				{
					name: 'Your channel',
					href: `/@${data.user?.username}`,
					icon: Channel,
					disabled: data.user === undefined,
				},
				{
					name: 'History',
					href: '/recipes/history',
					icon: History,
					disabled: data.user === undefined,
				},
				{
					name: 'Liked recipes',
					href: '/recipes/liked',
					icon: Liked,
					disabled: data.user === undefined,
				},
				{
					name: 'Recipe matcher',
					href: '/recipes/matcher',
					icon: Food,
				},
			],
		},
		$subscriptions.data?.success && $subscriptions.data.data.length
			? {
					name: 'Subscriptions',
					children: $subscriptions.data.data.map(sub => ({
						name: sub.name,
						href: `/@${sub.username}`,
						icon: 'https://via.placeholder.com/64',
					})),
			  }
			: undefined,
		{
			children: [
				{
					name: 'Settings',
					href: '/settings',
					icon: Settings,
				},
			],
		},
	] as (SidebarCategory | undefined)[];
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

			<Search />

			<div class="lg:w-64 grid place-items-end">
				<ProfileDropdown user={data.user} />
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

			{#each sidebar as category}
				{#if category}
					{#if category.name}
						{#if category.href}
							<li class="text-lg font-bold">
								{#if category.disabled}
									<button class="btn-disabled opacity-50">
										{category.name}
										<RightArrow class="w-6 h-6" />
									</button>
								{:else}
									<a href={category.href}>
										{category.name}
										<RightArrow class="w-6 h-6" />
									</a>
								{/if}
							</li>
						{:else}
							<span class="px-4 py-2 text-lg font-bold">{category.name}</span>
						{/if}
					{/if}

					{#each category.children as route}
						<li>
							<svelte:element
								this={route.disabled ? 'button' : 'a'}
								href={route.href}
								class:btn-disabled={route.disabled}
								class:opacity-50={route.disabled}
							>
								{#if typeof route.icon === 'string'}
									<img
										src={route.icon}
										class="h-6 w-6 rounded-full"
										alt="{route.name}'s avatar"
									/>
								{:else}
									<svelte:component this={route.icon} class="h-6 w-6" />
								{/if}
								{route.name}
							</svelte:element>
						</li>
					{/each}

					<div class="divider"></div>
				{/if}
			{/each}

			<span class="text-center brightness-75">© {year} Crave</span>
		</ul>
	</div>
</div>
