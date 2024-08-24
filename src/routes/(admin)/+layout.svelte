<script lang="ts">
	import {
		Sidebar,
		SidebarWrapper,
		SidebarBrand,
		SidebarItem,
		SidebarGroup,
		Drawer,
		Button
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import pb from '$lib/pocketbase';
	import { isAdmin, isModerator } from '$lib/helper/role';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import { onMount } from 'svelte';
	import { isCurrentUserAdmin, newSubmissionCount } from '$lib/stores/admin';
	import { toast } from '$lib/stores/page';
	import type { ClientResponseError } from 'pocketbase';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';

	let site = {
		name: '',
		href: '/admin',
		img: '/assets/logo.png'
	};

	$: activeUrl = $page.url.pathname;
	isCurrentUserAdmin.subscribe(i => console.log({ isCurrentUserAdmin: i }))
	let isMenuShown = true;

	const activeClass = 'text-black flex items-center p-2 text-base font-normal rounded-lg bg-white';
	const nonActiveClass =
		'text-white hover:text-black flex items-center p-2 text-base font-normal rounded-lg hover:bg-white';

	let currentUser: UsersResponse<Array<string>>;

	const validateUser = async () => {
		try {
			currentUser = (await pb.collection('users').authRefresh()).record as UsersResponse<
				Array<string>
			>;
			if (!pb.authStore.isValid || !(isAdmin(currentUser) || isModerator(currentUser))) {
				$isCurrentUserAdmin = false;
				window.location.href = '/logout';
			} else {
				$isCurrentUserAdmin = isAdmin(currentUser);
				const loading = document.getElementById('loading-modal');
				if (loading) {
					loading.style.opacity = '0';
					setTimeout(() => {
						loading.remove();
					}, 2000);
				}
			}
		} catch (err) {
			const error = err as ClientResponseError;
			if (error.status === 0) return;
			$toast = {
				type: 'danger',
				message: 'Unauthorized, please login'
			};
			$isCurrentUserAdmin = false;
			goto('/');
			throw err;
		}
	};

	const getSubmissionCount = async () => {
		const pendingSubmisson = await pb.collection('lb_record').getList(1, 1, {
			filter: 'lb_approve_log_via_entry.entry:length = 0'
		});
		$newSubmissionCount = pendingSubmisson.totalItems;
	};

	onMount(async () => {
		await validateUser();
		await getSubmissionCount();
		const loading = document.getElementById('loading-modal');
		if (loading) {
			loading.style.opacity = '0';
			setTimeout(() => {
				loading.remove();
			}, 2000);
		}
	});

	beforeNavigate(validateUser);

</script>

<Drawer
	hidden={false}
	backdrop={false}
	activateClickOutside={false}
	transitionType="fly"
	class="overflow-clip bg-transparent fixed h-min bottom-16 left-0 top-auto xl:absolute xl:bottom-auto z-40 {isMenuShown
		? ''
		: 'invisible'} xl:visible"
	id="sidebar"
>
	<Sidebar {activeUrl} {activeClass} {nonActiveClass}>
		<SidebarWrapper class="bg-black/40 text-white mr-6">
			<SidebarGroup>
				<SidebarBrand {site} />
				<SidebarItem label="Dashboard" href="/admin/">
					<svelte:fragment slot="icon">
						<Icon icon="ri:home-2-line" />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Leaderboard" href="/admin/leaderboard/">
					<svelte:fragment slot="icon">
						<Icon icon="ri:stairs-line" />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Submission" href="/admin/submission/" {spanClass}>
					<svelte:fragment slot="icon">
						<Icon icon="ri:download-2-line" />
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						{#if $newSubmissionCount > 0}
							<span
								class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium bg-red-400 rounded-full"
							>
								{$newSubmissionCount}
							</span>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Users" href="/admin/users/">
					<svelte:fragment slot="icon">
						<Icon icon="ri:user-3-line" />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Config" href="/admin/config/">
					<svelte:fragment slot="icon">
						<Icon icon="ri:settings-5-line" />
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<Button
	class="w-12 h-12 bg-black/40 fixed bottom-0 left-0 m-4 p-2 xl:invisible"
	on:click={() => (isMenuShown = !isMenuShown)}
>
	<Icon icon="ri:menu-fill" class="w-full h-full text-white" />
</Button>

<div class="flex p-4 mx-auto w-full bg-black/40 h-full text-white">
	<main class="xl:ml-64 w-full h-full overflow-y-scroll mx-auto bg-black/40 rounded p-4">
		<slot />
	</main>
</div>
