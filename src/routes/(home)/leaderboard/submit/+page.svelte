<script lang="ts">
	import { Input, Helper, Button, Select, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import pb from '$lib/pocketbase';
	import type { LeaderboardCategory } from '$lib/apiTypes';

	// populate form data
	let categories: Map<string, Array<LeaderboardCategory>> = new Map();
	let subcategories: Array<{ value: string; name: string }> = [];
	$: subcategories.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
	);
	let cars: Array<{ value: string; name: string }> = [];

	// form value
	let username: string | null = null;
	let selectedCategory: string | null = null;
	let timeHour: number | null = null;
	$: (timeHour ?? 0) > 59 && (timeHour = 59);
	let timeMinute: number | null = null;
	$: (timeMinute ?? 0) > 59 && (timeMinute = 59);
	let timeSecond: number | null = null;
	$: (timeSecond ?? 0) > 59 && (timeSecond = 59);
	let timeMilisecond: number | null = null;
	$: (timeMilisecond ?? 0) > 999 && (timeMilisecond = 999);
	let timeTotal = 0;
	$: timeTotal =
		(((parseInt(`${timeHour}`) || 0) * 60 + (parseInt(`${timeMinute}`) || 0)) * 60 +
			(parseInt(`${timeSecond}`) || 0)) *
			1000 +
		(parseInt(`${timeMilisecond}`) || 0);

	let selectedCar: string | null = null;
	let achieveDate: string | null = null;
	let videoUrl: string | null = null;
	let desc: string | null = null;

	let categoryName: string | null = null;

	let isCategoryDropdownOpen = false;

	const getCars = async () => {
		try {
			const res = await pb.collection('lb_cars').getFullList({ sort: '-created' });
			if (res.length === 0) throw Error(`Can't get data from api`);
			cars = res.map((data) => ({
				value: data.id,
				name: data.name
			}));
		} catch (err) {
			console.error(err);
		}
	};

	const getCategories = async () => {
		try {
			const res = await pb.collection('lb_category').getFullList();
			if (res.length === 0) throw Error(`Can't get data from api`);
			res.map((cat) => {
				const entry = categories.get(cat.category) ?? [];
				entry.push(cat);
				categories.set(cat.category, entry);
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onFormSubmit = async () => {
		const data: Record<string, string | number | null> = {
			user: username,
			car: selectedCar,
			category: selectedCategory,
			time: timeTotal,
			url: videoUrl
		};
		if (achieveDate !== null) data.achieved = achieveDate;
		await pb.collection('lb_record').create(data);
	};

	onMount(async () => {
		await getCategories();
		await getCars();
	});
</script>

<div class="grid w-full px-4 md:px-0 place-items-center gap-6">
	<div class="text-white text-6xl">Submit your best time</div>
	<form class="text-white text-left max-w-lg" on:submit|preventDefault={onFormSubmit}>
		<div class="mb-6">
			<label for="username" class="mb-2">Username</label>
			<Input type="text" placeholder="Plyrs" required bind:value={username} />
		</div>
		<div class="mb-6">
			<label for="categories" class="mb-2">Kategori</label>
			<div class="flex">
				<button
					class=" min-w-32 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
					type="button"
				>
					{categoryName ?? 'Pilih kategori'}
				</button>
				<Dropdown bind:open={isCategoryDropdownOpen}>
					{#each categories as category}
						<DropdownItem
							class="flex items-center"
							on:click={() => {
								categoryName = category[0];
								subcategories = category[1].map((i) => ({ value: i.id, name: i.subcategory }));
								isCategoryDropdownOpen = false;
							}}
						>
							{category[0]}
						</DropdownItem>
					{/each}
				</Dropdown>
				<Select
					items={subcategories}
					placeholder="Pilih track"
					class="!rounded-s-none"
					required
					bind:value={selectedCategory}
				/>
			</div>
		</div>
		<div class="mb-6">
			<label for="time" class="mb-2">Waktu</label>
			<div class="grid gap-6 grid-cols-4">
				<input style="display: none" type="text" id="time" bind:value={timeTotal} />
				<Input type="number" placeholder="hh" required bind:value={timeHour} />
				<Input type="number" placeholder="mm" required bind:value={timeMinute} />
				<Input type="number" placeholder="ss" required bind:value={timeSecond} />
				<Input type="number" placeholder="000" required bind:value={timeMilisecond} />
			</div>
		</div>
		<div class="grid gap-6 mb-6 md:grid-cols-2">
			<div>
				<label for="car" class="mb-2">Mobil</label>
				<Select id="car" items={cars} placeholder="Piih mobil" required bind:value={selectedCar} />
			</div>
			<div>
				<label for="achieveDate" class="mb-2">Tanggal</label>
				<Input type="date" id="achieveDate" required bind:value={achieveDate} />
			</div>
		</div>
		<div class="mb-6">
			<label for="videoUrl" class="mb-2">Video Youtube</label>
			<Input
				type="text"
				id="videoUrl"
				placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				required
				bind:value={videoUrl}
			/>
		</div>
		<div class="mb-6">
			<label for="desc" class="mb-2">Deskripsi</label>
			<Input let:props>
				<textarea id="desc" required {...props} bind:value={desc} />
			</Input>
		</div>
		<Helper class="mb-6 text-white text-sm">
			Data yang kamu kirimkan akan diperiksa oleh tim moderator kami. Jika dianggap valid dan sesuai
			dengan kategori, maka datamu akan tampil di leaderboard. Jika ditolak, kamu akan mendapatkan
			pesan dari moderator.
		</Helper>
		<Button type="submit">Submit</Button>
	</form>
</div>
