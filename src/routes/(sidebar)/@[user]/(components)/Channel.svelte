<script lang="ts">
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import type { User } from 'lucia';

	import { PUBLIC_FALLBACK_AVATAR_URL } from '$env/static/public';
	import type { User as APIUser } from '$lib/server/schema';
	import { formatNumber } from '$lib/util';

	import Subscribe from '$lib/components/Subscribe.svelte';

	import Verified from '~icons/ic/baseline-verified';

	export let channel: QueryObserverResult<APIUser>;
	export let user: User | undefined;
</script>

<div
	class="flex flex-row place-items-center gap-4 md:gap-6 lg:gap-8 bg-base-300 p-4 md:p-8 rounded-3xl"
>
	{#if channel.isPending || channel.isError}
		<div class="w-32 h-32 rounded-full skeleton" />

		<div class="flex flex-col gap-2">
			<div class="w-32 h-6 rounded skeleton" />
			<div class="w-32 h-6 rounded skeleton" />
		</div>
	{:else}
		<img
			src={channel.data.thumbnail ?? PUBLIC_FALLBACK_AVATAR_URL}
			alt="{channel.data.username}'s profile"
			class="w-24 lg:w-32 aspect-square object-cover rounded-full"
		/>

		<div class="flex flex-col flex-wrap gap-2">
			<h1 class="text-2xl md:text-4xl font-bold line-clamp-1">
				{channel.data.name}
			</h1>

			<div class="flex-wrap gap-2 place-items-center">
				<span class="flex flex-row place-items-center gap-1">
					@{channel.data.username}

					{#if channel.data.username === 'crave'}
						<span class="text-info"><Verified /></span>
					{/if}
				</span>
				<span>{formatNumber(channel.data.subscribers ?? 0)} subscribers</span>
				<span class="text-neutral-500">•</span>
				<span>{formatNumber(channel.data.recipes ?? 0)} recipes</span>
			</div>

			{#if user && user.userId !== channel.data.id}
				<div class="w-fit">
					<Subscribe user={channel.data} />
				</div>
			{/if}
		</div>
	{/if}
</div>
