<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import type { ComponentType,SvelteComponent } from 'svelte';

	import Channel from '~icons/ic/baseline-account-box';
	import Create from '~icons/ic/baseline-add';
	import RightArrow from '~icons/ic/baseline-chevron-right';
	import Food from '~icons/ic/baseline-fastfood';
	import Liked from '~icons/ic/baseline-favorite';
	import History from '~icons/ic/baseline-history';
	import Home from '~icons/ic/baseline-home';
	import Menu from '~icons/ic/baseline-menu';
	import Recipes from '~icons/ic/baseline-restaurant-menu';
	import Settings from '~icons/ic/baseline-settings';
	import Logo from '~icons/noto/shallow-pan-of-food';
	import { PUBLIC_FALLBACK_AVATAR_URL } from '$env/static/public';
	import { trpc } from '$lib/client';
	import { t } from '$lib/translations';

	import type { PageData } from '../$types';
	import ProfileDropdown from './(components)/ProfileDropdown.svelte';
	import Search from './(components)/Search.svelte';

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
		icon: ComponentType<SvelteComponent> | string;
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
					name: $t('label.name'),
					href: '/',
					icon: Home,
				},
				{
					name: $t('label.recipes'),
					href: '/recipes',
					icon: Recipes,
				},
			],
		},
		{
			name: $t('label.you'),
			href: `/@${data.user?.username}`,
			disabled: data.user === undefined,
			children: [
				{
					name: $t('label.your-channel'),
					href: `/@${data.user?.username}`,
					icon: Channel,
					disabled: data.user === undefined,
				},
				{
					name: $t('label.history'),
					href: '/recipes/history',
					icon: History,
					disabled: data.user === undefined,
				},
				{
					name: $t('label.likes'),
					href: '/recipes/liked',
					icon: Liked,
					disabled: data.user === undefined,
				},
				{
					name: $t('label.recipe-matcher'),
					href: '/recipes/matcher',
					icon: Food,
				},
			],
		},
		$subscriptions.data?.success && $subscriptions.data.data.length
			? {
				name: $t('label.subscriptions'),
				children: $subscriptions.data.data.map(sub => ({
					name: sub.name,
					href: `/@${sub.username}`,
					icon: sub.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL,
				})),
			}
			: undefined,
		{
			children: [
				{
					name: $t('label.settings'),
					href: '/settings',
					icon: Settings,
				},
			],
		},
	] as (SidebarCategory | undefined)[];
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div
			class="flex px-4 py-4 items-center sticky top-0 z-10 bg-base-100 place-content-between gap-4 leading-[0]"
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

			<div class="mx-auto">
				<Search />
			</div>

			<ProfileDropdown user={data.user} />
		</div>

		<div class="p-4 md:p-6 lg:p-8 flex-grow">
			<slot />
		</div>
	</div>
	<div class="drawer-side z-20">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay" />

		<ul class="menu p-4 w-64 text-base-content bg-base-100 min-h-full">
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

			<a
				href="/recipes/create"
				class="btn btn-primary"
				class:btn-disabled={data.user === undefined}
			>
				<Create class="w-6 h-6" />
				{$t('label.create')}
			</a>

			<div class="divider"></div>

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

			<span class="text-center brightness-75 mt-auto">© {year} Crave</span>
		</ul>
	</div>
</div>
