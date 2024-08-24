<script lang="ts">
	import UserList from '$lib/components/config/UserList.svelte';
	import pb from '$lib/pocketbase';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import { toast } from '$lib/stores/page';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let items: Array<UsersResponse<Array<string>>> = [];

	const getUserList = async () => {
		items = await pb.collection('users').getFullList<UsersResponse<Array<string>>>({
			sort: 'name'
		});
		console.log({ items });
	};

	const onRefresh = async () => {
		items = [];
		await getUserList();
	};

	const onUserPromote = async (e: CustomEvent<{ id: string }>) => {
		try {
			const oldRecord = items.findLast((item) => item.id === e.detail.id);
			const roles = oldRecord?.roles ?? [];
			roles.push('mod');
			await pb.collection('users').update(e.detail.id, { roles });
			$toast = {
				type: 'success',
				message: 'User promoted successfully'
			};
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Can't promote user. Probably you don't have permission."
			};
		}
		await getUserList();
	};

	const onUserDemote = async (e: CustomEvent<{ id: string }>) => {
		try {
			const oldRecord = items.findLast((item) => item.id === e.detail.id);
			const roles = oldRecord?.roles ?? [];
			const roleIndex = roles.findIndex((role) => role === 'mod');
			if (roleIndex === -1) throw new Error("Role doesn't exist");
			roles.splice(roleIndex, 1);
			await pb.collection('users').update(e.detail.id, { roles });
			$toast = {
				type: 'success',
				message: 'User demoted successfully'
			};
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Can't demote user. Probably you don't have permission."
			};
		}
		await getUserList();
	};

	const onUserBan = async (e: CustomEvent<{ id: string; isBanned: boolean }>) => {
		try {
			await pb.collection('users').update(e.detail.id, { isBanned: e.detail.isBanned });
			$toast = {
				type: 'success',
				message: `User ${e.detail.isBanned ? 'banned' : 'unbanned'} successfully`
			};
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: `Can't ${
					e.detail.isBanned ? 'banned' : 'unbanned'
				} user. Probably you don't have permission`
			};
		}
		await getUserList();
	};

	onMount(() => {
		getUserList();
	});
</script>

<Tabs
	tabStyle="underline"
	contentClass="p-4 bg-black/40 text-white rounded-lg rounded-t-none border-white border-2"
	activeClasses="p-4 text-primary-600 bg-white text-black rounded-t-lg"
	inactiveClasses="p-4 text-white rounded-t-lg hover:text-black hover:bg-white"
>
	<TabItem open title="Registered Users">
		<UserList
			items={items.filter((item) => Array.from(item.roles ?? []).indexOf('mod') === -1)}
			on:refresh={onRefresh}
			on:userpromote={onUserPromote}
			on:userban={onUserBan}
		/>
	</TabItem>
	<TabItem title="Banned Users">
		<UserList
			items={items.filter((item) => item.isBanned)}
			on:refresh={onRefresh}
			on:userpromote={onUserPromote}
			on:userban={onUserBan}
		/>
	</TabItem>
	<TabItem title="Moderators">
		<UserList
			items={items.filter((item) => Array.from(item.roles ?? []).indexOf('mod') >= 0)}
			on:refresh={onRefresh}
			on:userdemote={onUserDemote}
			on:userban={onUserBan}
		/>
	</TabItem>
</Tabs>
