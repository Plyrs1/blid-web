<script lang="ts">
	import pb from '$lib/pocketbase';
	import { page } from '$app/stores';
	import {
		A,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import Meta from '$lib/components/Meta.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { LbCarsResponse, LbRecordResponse, UsersResponse } from '$lib/pocketbaseType';

	let activeTab: string;
	let activeClass: Writable<string> = writable('/leaderboard');
	$: activeTab = $page.url.pathname;
	let searchTerm = '';

	// TODO: filter leaderboard result, probably need to move
	//       the async part in the render body into onMount
	// $: filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a,b) => a.time - b.time)

	const getLeaderboard = async () => {
		return pb
			.collection('lb_record')
			.getList<LbRecordResponse<{ user: UsersResponse; car: LbCarsResponse }>>(1, 10, {
				sort: 'time',
				expand: 'user,car',
				fields: 'expand.user.name,expand.car.name,category,time,achieved,url',
				filter: 'lb_approve_log_via_entry.approvedBy>0' // only show approved entry
			});
	};

	const formatTime = (ms: number) => {
		return new Date(ms).toISOString().slice(11, -1); // "03:25:45.000"
	};
</script>

<Meta title="Leaderboard" />
<div class="grid w-full px-4 md:px-0 place-items-center gap-6">
	<div class="text-white text-6xl">Leaderboard</div>
	<TabBar bind:activeClass bind:activeTab>
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
	</TabBar>
	<div class="container flex flex-col gap-4">
		<TableSearch
			placeholder="Search by name"
			hoverable={true}
			bind:inputValue={searchTerm}
			color="custom"
			divClass="bg-red"
		>
			<TableHead theadClass="text-white">
				<TableHeadCell>Username</TableHeadCell>
				<TableHeadCell>Best Time</TableHeadCell>
				<TableHeadCell>Car Used</TableHeadCell>
				<TableHeadCell>Achieved On</TableHeadCell>
				<TableHeadCell>Watch</TableHeadCell>
			</TableHead>
			<TableBody>
				{#await getLeaderboard()}
					Loading...
				{:then lb}
					{#each lb.items as item}
						<TableBodyRow>
							<TableBodyCell>{item.expand?.user?.name ?? 'Unknown Racer'}</TableBodyCell>
							<TableBodyCell>{formatTime(item.time)}</TableBodyCell>
							<TableBodyCell>{item.expand?.car?.name ?? 'Unknown Car'}</TableBodyCell>
							<TableBodyCell
								>{item.achieved
									? new Date(item.achieved).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
									  })
									: '-'}</TableBodyCell
							>
							<TableBodyCell>
								<A href={item.url}>Watch</A></TableBodyCell
							>
						</TableBodyRow>
					{/each}
				{/await}
			</TableBody>
		</TableSearch>
	</div>
</div>
