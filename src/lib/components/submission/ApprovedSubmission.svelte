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
		Modal,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,

		Textarea,

		Tooltip


	} from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

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

	let isRejectModalOpen = false;
	let rejectId = "";

	const onRejectFormSubmit = (e: SubmitEvent) => {
		const configValues = new FormData(e.target as HTMLFormElement);
		dispatcher('reject', { id: configValues.get("id"), reason: configValues.get("reason") });
		isRejectModalOpen = false;
	}

	const dispatcher = createEventDispatcher();
	const onRefresh = () => {
		dispatcher('refresh');
	};

	const onReject = (id: string) => {
		rejectId = id
		isRejectModalOpen = true;
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
			<TableHeadCell>Approved By</TableHeadCell>
			<TableHeadCell>Approved On</TableHeadCell>
			<TableHeadCell>Video</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filteredItems as list}
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
					<TableBodyCell>
						{list.expand?.author?.name ?? '-'}
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
								on:click={() => onReject(list.id)}
							>
								<Icon icon="ri:close-line" width="1.6em" />
							</Button>
							<Tooltip>Reject Submission</Tooltip>
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

<form class="flex flex-col space-y-6" action="#" on:submit|preventDefault={onRejectFormSubmit}>
	<Modal title="Reject submission" bind:open={isRejectModalOpen} color="red">
		<div class="mb-6">
			<label for="rejectReason">Reject reason</label>
			<input hidden name="id" bind:value={rejectId} />
			<Textarea
				id="rejectReason"
				name="reason"
				placeholder="Terlalu keren untuk dunia nyata"
				rows="4"
				required
			/>
		</div>
		<svelte:fragment slot="footer">
			<Button type="submit" color="red">Reject</Button>
			<Button color="alternative">Cancel</Button>
		</svelte:fragment>
	</Modal>
</form>
