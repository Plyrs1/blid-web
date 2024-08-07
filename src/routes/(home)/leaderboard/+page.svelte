<script lang="ts">
	import pb from '$lib/pocketbase';
	import {
		Button,
		ButtonGroup,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Meta from '$lib/components/Meta.svelte';
	// import Tab from '$lib/components/Tab.svelte';
	// import TabBar from '$lib/components/TabBar.svelte';
	// import { writable, type Writable } from 'svelte/store';
	import type {
		LbCarsResponse,
		LbCategoryResponse,
		LbRecordResponse,
		UsersResponse
	} from '$lib/pocketbaseType';
	import { formatRaceTime } from '$lib/helper/misc';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// let activeTab: string;
	// let activeClass: Writable<string> = writable('/leaderboard');
	// $: activeTab = $page.url.pathname;
	let searchTerm = '';
	let leaderboardEntry: Array<
		LbRecordResponse<{ user: UsersResponse; car: LbCarsResponse; category: LbCategoryResponse }>
	> = [];
	// TODO: filter leaderboard result, probably need to move
	//       the async part in the render body into onMount
	$: filteredItems = leaderboardEntry
		.filter((item) =>
			`${item.expand?.user.name}${item.expand?.car.name}${item.expand?.category.category}${item.expand?.category.subcategory}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => a.time - b.time);

	const getLeaderboard = async () => {
		const result = await pb
			.collection('lb_record')
			.getList<
				LbRecordResponse<{ user: UsersResponse; car: LbCarsResponse; category: LbCategoryResponse }>
			>(1, 10, {
				sort: 'time',
				expand: 'user,car,category',
				fields:
					'expand.user.name,expand.car.name,expand.category.category,expand.category.subcategory,time,achieved,url',
				filter: 'lb_approve_log_via_entry.isApproved = true' // only show approved entry
			});
		leaderboardEntry = result.items;
	};
	onMount(async () => {
		await getLeaderboard();
	});
</script>

<Meta title="Leaderboard" />
<div class="grid w-full px-4 md:px-0 place-items-center gap-6">
	<div class="text-white text-6xl">Leaderboard</div>
	<!-- <TabBar bind:activeClass bind:activeTab>
		<div slot="left">
			<Tab href="/leaderboard" name="All" />
			<Tab href="/leaderboard/cars" name="Circuit" />
			<Tab href="/leaderboard/vinyls" name="Drag" />
			<Tab href="/leaderboard/tweaks" name="Sprint" />
			<Tab href="/leaderboard/others" name="Team Escape" />
		</div>
		<div slot="right">
			<Tab href="/leaderboard" name="Active Rate" />
			<Tab href="/leaderboard/cars" name="Current Race" />
		</div>
	</TabBar> -->
	<div class="container flex flex-col gap-4 bg-black/40 rounded p-4">
		<div class="flex gap-2 justify-end">
			<Input
				placeholder="Search by car name, author"
				bind:value={searchTerm}
				class="max-w-64 mr-auto"
			/>
			<Button
				outline
				class="shrink-0 border-white text-white gap-2 hover:bg-white hover:text-black"
				size="sm"
				on:click={getLeaderboard}
			>
				<Icon icon="ri:refresh-line" width="1.4em" />
				Refresh
			</Button>
			<Button
				outline
				class="shrink-0 border-white text-white gap-2 hover:bg-white hover:text-black"
				size="sm"
				on:click={() => goto('/leaderboard/submit/')}
			>
				<Icon icon="ri:add-line" width="1.4em" />
				Submit your own Time
			</Button>
		</div>
		<Table color="custom">
			<TableHead theadClass="text-white">
				<TableHeadCell>Username</TableHeadCell>
				<TableHeadCell>Best Time</TableHeadCell>
				<TableHeadCell>Car Used</TableHeadCell>
				<TableHeadCell>Race Type - Track</TableHeadCell>
				<TableHeadCell>Achieved On</TableHeadCell>
				<TableHeadCell>Watch</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each filteredItems as item}
					<TableBodyRow>
						<TableBodyCell>{item.expand?.user?.name ?? 'Unknown Racer'}</TableBodyCell>
						<TableBodyCell>{formatRaceTime(item.time)}</TableBodyCell>
						<TableBodyCell>{item.expand?.car?.name ?? 'Unknown Car'}</TableBodyCell>
						<TableBodyCell>
							{item.expand?.category.category} - {item.expand?.category.subcategory}
						</TableBodyCell>
						<TableBodyCell>
							{item.achieved
								? new Date(item.achieved).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
								  })
								: '-'}
						</TableBodyCell>
						<TableBodyCell>
							<ButtonGroup>
								<Button
									outline
									class="border-white text-white hover:bg-white hover:text-black"
									on:click={() => window.open(item.url, '_blank')?.focus()}
								>
									<Icon icon="ri:play-circle-line" width="1.6em" />
								</Button>
							</ButtonGroup>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
