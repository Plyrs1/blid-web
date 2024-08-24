<script lang="ts">
	import { delay, formatDate, formatRaceTime } from '$lib/helper/misc';
	import type {
		LbApproveLogResponse,
		LbCarsResponse,
		LbCategoryResponse,
		LbRecordResponse,
		UsersResponse
	} from '$lib/pocketbaseType';
	import Icon from '@iconify/svelte';
	import {
		Button,
		ButtonGroup,
		Input,
		P,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,

		Tooltip

	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data: Array<
		LbApproveLogResponse<{
			entry: LbRecordResponse<{
				user: UsersResponse;
				car: LbCarsResponse;
				category: LbCategoryResponse;
			}>;
			author: UsersResponse;
		}>
	> = [];
	export let searchTerm: string;
	$: filteredItems = data.filter(
		(item) =>
			`${item.expand?.entry.expand?.user?.name}${item.expand?.entry.expand?.category.category}${item.expand?.entry.expand?.category.subcategory}`
				.toLowerCase()
				.indexOf(searchTerm.toLowerCase()) !== -1
	);

	let openRow: number | null = null
	const toggleRow = (i: number) => openRow = openRow === i ? null : i;

	const dispatcher = createEventDispatcher();
	const onRefresh = () => {
		dispatcher('refresh');
	};
	const onAccept = (id: string) => {
		dispatcher('accept', { id });
	};
	const onDelete = (id: string) => {
		dispatcher('delete', { id });
	};
</script>

<!-- TODO: Consolidate all tables into one reusable component -->
<div class="flex flex-col gap-2 justify-between">
	<div class="flex gap-2 justify-between">
		<Input placeholder="Search by user, category" bind:value={searchTerm} class="max-w-64" />
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
	<Table color="custom" noborder>
		<TableHead>
			<TableHeadCell>User</TableHeadCell>
			<TableHeadCell>Car</TableHeadCell>
			<TableHeadCell>Time</TableHeadCell>
			<TableHeadCell>Category</TableHeadCell>
			<TableHeadCell>Rejected By</TableHeadCell>
			<TableHeadCell>Rejected On</TableHeadCell>
			<TableHeadCell>Video</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filteredItems as list, i}
				<TableBodyRow>
					<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium w-full min-w-max">
						{list.expand?.entry.expand?.user?.name ?? ''}
					</TableBodyCell>
					<TableBodyCell>
						{list.expand?.entry.expand?.car.name}
					</TableBodyCell>
					<TableBodyCell>
						{formatRaceTime(list.expand?.entry.time ?? 0)}
					</TableBodyCell>
					<TableBodyCell>
						{list.expand?.entry.expand?.category.category} - {list.expand?.entry.expand?.category
							.subcategory}
					</TableBodyCell>
					<TableBodyCell on:click={() => toggleRow(i)}>
						<div>{list.expand?.author?.name ?? '-'}</div>
						<Tooltip>Click to view reject reason</Tooltip>
					</TableBodyCell>
					<TableBodyCell>
						{formatDate(list.created)}
					</TableBodyCell>
					<TableBodyCell>
						<ButtonGroup>
							<Button
								outline
								class="border-white text-white hover:bg-white hover:text-black"
								on:click={() => window.open(list.expand?.entry.url, '_blank')?.focus()}
							>
								<Icon icon="ri:play-circle-line" width="1.6em" />
							</Button>
							<Tooltip>Open YouTube</Tooltip>
						</ButtonGroup>
					</TableBodyCell>
					<TableBodyCell>
						<ButtonGroup>
							<Button
								outline
								class="border-white text-white hover:bg-white hover:text-black"
								on:click={() => onAccept(list.id)}
							>
								<Icon icon="ri:check-line" width="1.6em" />
							</Button>
							<Tooltip>Approve Submission</Tooltip>
							<Button
								outline
								class="border-white text-white hover:bg-white hover:text-black"
								on:click={() => onDelete(list.id)}
							>
								<Icon icon="ri:delete-bin-6-line" width="1.6em" />
							</Button>
							<Tooltip>Move to Pending</Tooltip>
						</ButtonGroup>
					</TableBodyCell>
				</TableBodyRow>
				{#if openRow === i && !!list.reason}
				<TableBodyRow>
					<TableBodyCell colspan="8" tdClass="bg-black/40 p-4 rounded-lg rounded-t-none">
						<div transition:slide>
							<span class=" text-lg">Reason:</span>
							<P class="text-white">{list.reason}</P>
						</div>
					</TableBodyCell>
				</TableBodyRow>
				{/if}
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
	{/if}
</div>
