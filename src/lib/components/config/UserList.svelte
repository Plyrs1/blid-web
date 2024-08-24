<script lang="ts">
	import {
		Button,
		Input,
		Pagination,
		Spinner,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import UserListRow from './UserListRow.svelte';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import { createEventDispatcher } from 'svelte';
	import { delay } from '$lib/helper/misc';
	import { isCurrentUserAdmin } from '$lib/stores/admin';

	export let items: Array<UsersResponse<Array<string>>> = [];

	const dispatcher = createEventDispatcher();

	let searchTerm = '';
	let currentPage = 1;
	let pageSize = 10;

	$: filteredItems = items
		.filter((item) => `${item.name.toLowerCase()}`.indexOf(searchTerm.toLowerCase()) !== -1)
		.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const onRefresh = () => {
		dispatcher('refresh');
	};
</script>

<!-- TODO: Consolidate all tables into one reusable component -->
<div class="flex flex-col gap-2 justify-between">
	<div class="flex gap-2 justify-between">
		<Input placeholder="Search by car name, author" bind:value={searchTerm} class="max-w-64" />
		<Button
			outline
			class="shrink-0 border-white text-white gap-2 hover:bg-white hover:text-black"
			size="sm"
			on:click={onRefresh}
		>
			<Icon icon="ri:refresh-line" width="1.4em" />
			Refresh
		</Button>
	</div>
	<Table color="custom">
		<TableHead>
			<TableHeadCell>ID</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Discord ID</TableHeadCell>
			<TableHeadCell>Last Login</TableHeadCell>
			<TableHeadCell>Registered On</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each filteredItems as item}
				<UserListRow {item} isAdmin={$isCurrentUserAdmin} on:userpromote on:userdemote on:userban />
			{/each}
		</TableBody>
	</Table>
	{#if filteredItems.length === 0 && searchTerm.length === 0}
		<div class="flex justify-center items-center bg-red w-full h-32">
			{#await delay(3000)}
				<Spinner size="12" />
			{:then}
				No data
			{/await}
		</div>
	{:else}
		<div class="flex flex-col md:flex-row w-full justify-start items-center gap-2 pt-4 px-4">
			<div class="text-sm text-white">
				Showing <span class="font-semibold text-white">{(currentPage - 1) * pageSize + 1}</span>
				to
				<span class="font-semibold text-white">{filteredItems.length}</span>
				of
				<span class="font-semibold text-white">{items.length}</span>
				Entries
			</div>
			{#if items.length > 10}
				<Pagination
					table
					on:next={() => currentPage < items.length / 10 && currentPage++}
					on:previous={() => currentPage > 1 && currentPage--}
				>
					<div slot="prev" class="flex items-center gap-2 text-white">
						<Icon icon="ri:arrow-drop-up-line" class="-rotate-90 h-full w-auto" width="2em" />
						Prev
					</div>
					<div slot="next" class="flex items-center gap-2 text-white">
						Next
						<Icon icon="ri:arrow-drop-up-line" class="rotate-90" width="2em" />
					</div>
				</Pagination>
			{/if}
		</div>
	{/if}
</div>
