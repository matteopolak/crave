<script lang="ts">
	import type { User } from '$lib/server/schema';
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import Verified from '~icons/ic/baseline-verified';
	import Subscribe from '$lib/components/Subscribe.svelte';
	import { formatNumber } from '$lib/util';

	export let user: QueryObserverResult<User>;
</script>

<div class="flex flex-row place-items-center gap-8">
	{#if user.isPending || user.isError}
		<div class="w-32 h-32 rounded-full skeleton" />

		<div class="flex flex-col gap-2">
			<div class="w-32 h-6 rounded skeleton" />
			<div class="w-32 h-6 rounded skeleton" />
		</div>
	{:else}
		<img
			src="https://via.placeholder.com/256"
			alt="{user.data.username}'s profile"
			class="w-32 h-32 object-cover rounded-full"
		/>

		<div class="flex flex-col flex-wrap gap-2">
			<h1 class="text-4xl font-bold">{user.data.name}</h1>

			<div class="flex flex-row gap-2 place-items-center">
				<span class="flex flex-row place-items-center gap-1">
					@{user.data.username}

					{#if user.data.username === 'crave'}
						<span class="text-info"><Verified /></span>
					{/if}
				</span>
				<span class="text-neutral-500">•</span>
				<span>{formatNumber(user.data.subscribers ?? 0)} subscribers</span>
				<span class="text-neutral-500">•</span>
				<span>{formatNumber(user.data.recipes ?? 0)} recipes</span>
			</div>

			<div class="w-fit">
				<Subscribe user={user.data} />
			</div>
		</div>
	{/if}
</div>
