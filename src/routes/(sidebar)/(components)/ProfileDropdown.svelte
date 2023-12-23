<script lang="ts">
	import { addFromQuery } from '$lib/util';
	import type { User } from 'lucia';

	import LogOut from '~icons/ic/baseline-logout';
	import Settings from '~icons/ic/baseline-settings';

	import LogIn from '~icons/ic/outline-account-circle';

	export let user: User | undefined;
</script>

{#if user}
	<div class="dropdown dropdown-bottom dropdown-end">
		<div tabindex="0" role="button" class="avatar">
			<div class="h-10 rounded-full">
				<img
					src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
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
							src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
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

			<li>
				<a href="/settings">
					<Settings />
					Settings
				</a>
			</li>
			<li>
				<a href="/logout" use:addFromQuery>
					<LogOut />
					Log out
				</a>
			</li>
		</ul>
	</div>
{:else}
	<a href="/login" class="btn btn-ghost rounded-xl" use:addFromQuery>
		<LogIn class="w-6 h-6" />
		Sign in
	</a>
{/if}

<style>
	li > a {
		@apply rounded-none;
	}
</style>
