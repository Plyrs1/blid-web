<script lang="ts">
	import { formatDate } from '$lib/helper/misc';
	import type { LbCarsResponse, UsersResponse } from '$lib/pocketbaseType';
	import Icon from '@iconify/svelte';
	import { Button, ButtonGroup, Input, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	let editedName: string;

	export let item: Partial<LbCarsResponse<{ author: UsersResponse }>> = {};
	export let isEditing = false;

	const dispatcher = createEventDispatcher();

	const onCancelEdit = () => {
		isEditing = false;
		dispatcher('cancelEdit');
	};
	const onEdit = (id: string | undefined, name: string) => {
		isEditing = false;
		dispatcher('edit', { id, name });
	};
	const onDelete = (id: string | undefined) => {
		dispatcher('delete', { id });
	};

	onMount(() => {
		editedName = item.name ?? '';
	});
</script>

<TableBodyRow>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">{item.id ?? ''}</TableBodyCell>
	<TableBodyCell
		tdClass="px-6 py-2 whitespace-nowrap font-medium"
		style="width: 100%; min-width:max-content"
	>
		{#if isEditing}
			<ButtonGroup>
				<Input bind:value={editedName} />
				<Button
					outline
					class="border-white text-white hover:bg-white hover:text-black"
					on:click={() => onEdit(item.id, editedName)}
					disabled={item.name == editedName || editedName.length === 0}
				>
					<Icon icon="ri:save-3-line" width="1.6em" />
				</Button>
				<Button
					outline
					class="border-white text-white hover:bg-white hover:text-black"
					on:click={onCancelEdit}
				>
					<Icon icon="ri:close-line" width="1.6em" />
				</Button>
			</ButtonGroup>
		{:else}
			{item.name ?? ''}
		{/if}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		{item.expand?.author.name ?? ''}
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		<span title={item.updated ? `\nUpdated on ${formatDate(item.updated)}` : ''}>
			{item.created ? formatDate(item.created) : ''}
		</span>
	</TableBodyCell>
	<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
		<ButtonGroup>
			<Button
				outline
				class="border-white text-white hover:bg-white hover:text-black"
				on:click={() => (isEditing = !isEditing)}
			>
				<Icon icon="ri:pencil-line" width="1.6em" />
			</Button>
			<Button
				outline
				class="border-white text-white hover:bg-white hover:text-black"
				on:click={() => onDelete(item.id)}
			>
				<Icon icon="ri:delete-bin-6-line" width="1.6em" />
			</Button>
		</ButtonGroup>
	</TableBodyCell>
</TableBodyRow>
