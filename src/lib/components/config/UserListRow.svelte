<script lang="ts">
	import { formatDate } from '$lib/helper/misc';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import Icon from '@iconify/svelte';
	import {
		Button,
		ButtonGroup,
		Spinner,
		TableBodyCell,
		TableBodyRow,
		Tooltip
	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const avatarCache = new Map<string, string | null>();

	const dispatcher = createEventDispatcher();

	const onUserPromote = (id: string | undefined) => {
		dispatcher('userpromote', { id });
	};

	const onUserDemote = (id: string | undefined) => {
		dispatcher('userdemote', { id });
	};

	const onUserBan = (id: string | undefined, isBanned: boolean) => {
		dispatcher('userban', { id, isBanned });
	};

	const fetchUserAvatar = async (url: string) => {
		const cache = avatarCache.get(url);
		if (cache) return cache;
		if (cache === null) throw new Error("Can't fetch user avatar");
		const res = await fetch(url);
		if (!res.ok) {
			avatarCache.set(url, null);
			throw new Error("Can't fetch user avatar");
		}
		const blobUrl = URL.createObjectURL(await res.blob());
		avatarCache.set(url, blobUrl);
		return blobUrl;
	};

	export let item: UsersResponse<Array<string>>;
	export let isAdmin: boolean = false;
</script>

<TableBodyRow>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">{item.id ?? ''}</TableBodyCell>
	<TableBodyCell
		tdClass="px-6 py-2 whitespace-nowrap font-medium"
		style="width: 100%; min-width:max-content"
	>
		<div class="w-fit">{item.name ?? '-'}</div>
		{#if item.avatarUrl}
			<Tooltip placement="bottom-start">
				<div class="flex justify-center items-center w-32 h-32">
					{#await fetchUserAvatar(item.avatarUrl)}
						<Spinner size="12" />
					{:then src}
						<img {src} alt={item.name} />
					{:catch}
						<Icon icon="ri:error-warning-line" width="4em" />
					{/await}
				</div>
			</Tooltip>
		{/if}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		{item.discordId ?? '-'}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		{item.lastLogin ? formatDate(item.lastLogin) : '-'}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		<div>{item.created ? formatDate(item.created) : '-'}</div>
		{#if item.updated}
			<Tooltip>Updated on {formatDate(item.updated)}</Tooltip>
		{/if}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		<ButtonGroup>
			{#if isAdmin}
				{#if Array.from(item.roles ?? []).indexOf('mod') === -1}
					<Button
						outline
						class="border-white text-white hover:bg-white hover:text-black"
						on:click={() => onUserPromote(item.id)}
					>
						<Icon icon="ri:shield-user-line" width="1.6em" />
					</Button>
					<Tooltip>Promote to moderator</Tooltip>
				{:else}
					<Button
						outline
						class="border-white text-red-500 hover:bg-white hover:text-black"
						on:click={() => onUserDemote(item.id)}
					>
						<Icon icon="ri:user-unfollow-line" width="1.6em" />
					</Button>
					<Tooltip>Demote user</Tooltip>
				{/if}
			{/if}
			<Button
				outline
				class="border-white {item.isBanned
					? 'text-green-500'
					: 'text-red-500'} hover:bg-white hover:text-black rounded-r-lg"
				on:click={() => onUserBan(item.id, !item.isBanned)}
			>
				{#if item.isBanned}
					<Icon icon="ri:lock-unlock-line" width="1.6em" />
                    <Tooltip>Unban user</Tooltip>
				{:else}
					<Icon icon="ri:lock-2-line" width="1.6em" />
                    <Tooltip>Ban user</Tooltip>
				{/if}
			</Button>
		</ButtonGroup>
	</TableBodyCell>
</TableBodyRow>
