<script lang="ts">
	import type { User as APIUser } from '$lib/server/schema';
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import Verified from '~icons/ic/baseline-verified';
	import Subscribe from '$lib/components/Subscribe.svelte';
	import { formatNumber } from '$lib/util';
	import type { User } from 'lucia';

	export let channel: QueryObserverResult<APIUser>;
	export let user: User | undefined;
</script>

<div class="flex flex-row place-items-center gap-8">
	{#if channel.isPending || channel.isError}
		<div class="w-32 h-32 rounded-full skeleton" />

		<div class="flex flex-col gap-2">
			<div class="w-32 h-6 rounded skeleton" />
			<div class="w-32 h-6 rounded skeleton" />
		</div>
	{:else}
		<img
			src="https://via.placeholder.com/256"
			alt="{channel.data.username}'s profile"
			class="w-32 h-32 object-cover rounded-full"
		/>

		<div class="flex flex-col flex-wrap gap-2">
			<h1 class="text-4xl font-bold">{channel.data.name}</h1>

			<div class="flex flex-row gap-2 place-items-center">
				<span class="flex flex-row place-items-center gap-1">
					@{channel.data.username}

					{#if channel.data.username === 'crave'}
						<span class="text-info"><Verified /></span>
					{/if}
				</span>
				<span class="text-neutral-500">•</span>
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
