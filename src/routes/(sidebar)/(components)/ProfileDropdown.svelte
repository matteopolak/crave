<script lang="ts">
	import type { User } from 'lucia';
	import type { ComponentType,SvelteComponent } from 'svelte';

	import Channel from '~icons/ic/baseline-account-box';
	import LogOut from '~icons/ic/baseline-logout';
	import Palette from '~icons/ic/baseline-palette';
	import Settings from '~icons/ic/baseline-settings';
	import Translate from '~icons/ic/baseline-translate';
	import LogIn from '~icons/ic/outline-account-circle';
	import { PUBLIC_FALLBACK_AVATAR_URL } from '$env/static/public';
	import { t } from '$lib/translations';
	import { addFromQuery } from '$lib/util';

	export let user: User | undefined;

	type Item = {
		name: string;
		icon: ComponentType<SvelteComponent>;
		href: string;
		use?: (node: HTMLAnchorElement) => void;
	};

	$: items =
		user &&
		([
			[
				{
					name: $t('label.your-channel'),
					href: `/@${user.username}`,
					icon: Channel,
				},
			],
			[
				{
					name: $t('label.appearance'),
					href: '/settings#appearance',
					icon: Palette,
				},
				{
					name: $t('label.language'),
					href: '/settings#language',
					icon: Translate,
				},
				{
					name: $t('label.settings'),
					href: '/settings',
					icon: Settings,
				},
			],
			[
				{
					name: $t('auth.log-out'),
					href: '/logout',
					icon: LogOut,
					use: addFromQuery,
				},
			],
		] as Item[][]);
</script>

{#if user && items}
	<div class="dropdown dropdown-bottom dropdown-end">
		<div tabindex="0" role="button" class="avatar">
			<div class="h-10 rounded-full">
				<img
					src={user.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL}
					alt="{user.name}'s avatar"
				/>
			</div>
		</div>

		<ul
			tabindex="-1"
			class="dropdown-content z-[1] menu py-4 px-0 m-0 shadow bg-base-300 rounded-box w-64"
		>
			<div class="flex flex-row gap-4 px-4 mb-2">
				<div class="avatar">
					<div class="h-10 rounded-full">
						<img
							src={user.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL}
							alt="{user.name}'s avatar"
						/>
					</div>
				</div>

				<div>
					<span class="font-bold text-lg line-clamp-1">{user.name}</span>
					<span class="text-sm text-neutral-500 line-clamp-1">
						@{user.username}
					</span>
				</div>
			</div>

			{#each items as children, i}
				{#each children as child}
					<li>
						{#if child.use}
							<a href={child.href} use:child.use>
								<svelte:component this={child.icon} />
								{child.name}
							</a>
						{:else}
							<a href={child.href}>
								<svelte:component this={child.icon} />
								{child.name}
							</a>
						{/if}
					</li>
				{/each}

				{#if i !== items.length - 1}
					<div class="divider my-0" />
				{/if}
			{/each}
		</ul>
	</div>
{:else}
	<a href="/login" class="btn btn-ghost rounded-xl" use:addFromQuery>
		<LogIn class="w-6 h-6" />
		<span class="hidden md:block">
			{$t('auth.log-in')}
		</span>
	</a>
{/if}

<style>
	li > a {
		@apply rounded-none;
	}
</style>
