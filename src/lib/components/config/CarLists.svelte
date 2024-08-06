<script lang="ts">
	import pb from '$lib/pocketbase';
	import type { LbCarsResponse, UsersResponse } from '$lib/pocketbaseType';
	import Icon from '@iconify/svelte';
	import {
		Button,
		Input,
		Pagination,
		Table,
		TableBody,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import CarListRow from './CarListRow.svelte';
	import { toast } from '$lib/stores/page';
	let searchTerm = '';
	let items: Array<LbCarsResponse<{ submitter: UsersResponse }>> = [];
	let currentPage = 1;
	let pageSize = 10;
	let isAdding = false;
	$: filteredItems = items
		.filter(
			(item) =>
				`${item.name.toLowerCase()}${item.expand?.submitter.name}`.indexOf(
					searchTerm.toLowerCase()
				) !== -1
		)
		.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const getCarLists = async () => {
		items = await pb
			.collection('lb_cars')
			.getFullList<LbCarsResponse<{ submitter: UsersResponse }>>({
				sort: 'created',
				expand: 'submitter',
				fields: 'id,name,expand.submitter.name,created,updated'
			});
	};

	const onEdit = async (e: CustomEvent<{ id: string | undefined; name: string }>) => {
		try {
			const { id, name } = e.detail;
			if (!id) {
				await pb.collection('lb_cars').create({
					name
				});
			} else {
				await pb.collection('lb_cars').update(id, {
					name
				});
			}
			$toast = {
				type: 'success',
				message: 'Car saved successfully',
				duration: 2000
			};
		} catch (err) {
			console.error({ err });
			$toast = {
				type: 'danger',
				message: 'Cannot save car',
				duration: 2000
			};
		} finally {
			onCancelEdit();
		}
	};

	const onDelete = async (e: CustomEvent<{ id: string | undefined }>) => {
		const { id } = e.detail;
		if (!id) return;
		try {
			await pb.collection('lb_cars').delete(id);
			$toast = {
				type: 'success',
				message: 'Car deleted successfully',
				duration: 2000
			};
		} catch (err) {
			console.error({ err });
			$toast = {
				type: 'danger',
				message: 'Cannot delete car. You can only delete the car that you submit.'
			};
		} finally {
			onCancelEdit();
		}
	};

	const onCancelEdit = async () => {
		isAdding = false;
		await getCarLists();
		return;
	};

	onMount(() => {
		getCarLists();
	});
</script>

<div class="flex gap-2 justify-between">
	<Input placeholder="Search by car name, submitter" bind:value={searchTerm} class="max-w-64" />
	<Button
		outline
		class="shrink-0 border-white text-white gap-2 hover:bg-white hover:text-black"
		size="sm"
		on:click={() => {
			isAdding = true;
		}}
	>
		<Icon icon="ri:add-line" width="1.4em" />
		Add New
	</Button>
</div>
<Table color="custom">
	<TableHead>
		<TableHeadCell>ID</TableHeadCell>
		<TableHeadCell>Car Name</TableHeadCell>
		<TableHeadCell>Submitter</TableHeadCell>
		<TableHeadCell>Created On</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each filteredItems as item}
			<CarListRow {item} on:edit={onEdit} on:delete={onDelete} on:cancelEdit={onCancelEdit} />
		{/each}
		{#if isAdding}
			<CarListRow isEditing on:edit={onEdit} on:delete={onDelete} />
		{/if}
	</TableBody>
</Table>
<div class="flex flex-col md:flex-row w-full justify-start items-center gap-2 pt-4 px-4">
	<div class="text-sm text-white">
		Showing <span class="font-semibold text-white">{(currentPage - 1) * pageSize + 1}</span>
		to
		<span class="font-semibold text-white">{filteredItems.length}</span>
		of
		<span class="font-semibold text-white">{items.length}</span>
		Entries
	</div>

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
</div>
