<script lang="ts">
	import { trpc } from '$lib/client';
	import type { User } from '$lib/server/schema';
	import { t } from '$lib/translations';

	export let user: User;

	async function toggle() {
		user.subscribed = !user.subscribed;
		user = user;

		await trpc.users[user.subscribed ? 'subscribe' : 'unsubscribe'].mutate({
			username: user.username,
		});
	}
</script>

<button
	on:click={toggle}
	class="btn"
	class:btn-neutral={user.subscribed}
	class:btn-primary={!user.subscribed}
>
	{#if user.subscribed}
		{$t('label.unsubscribe')}
	{:else}
		{$t('label.subscribe')}
	{/if}
</button>
