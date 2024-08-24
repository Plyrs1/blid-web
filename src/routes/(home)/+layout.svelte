<script lang="ts">
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { config, isScrolled, scrollOffset } from '$lib/stores/page';
	import { afterNavigate } from '$app/navigation';
	import { isAdmin, isModerator } from '$lib/helper/role';
	import pb from '$lib/pocketbase';
	import type { UsersResponse } from '$lib/pocketbaseType';
	import { onMount } from 'svelte';
	import { parseConfig } from '$lib/helper/misc';

	$: activeUrl = $page.url.pathname;
	$: currentUser = pb.authStore.model as UsersResponse<Array<string>>;

	let activeClass = 'text-white font-bold hover:bg-white hover:text-black md:px-4 md:py-2';
	let nonActiveClass = 'text-white hover:bg-white hover:text-black md:px-4 md:py-2';

	function scrollDetect(el: Event): void {
		const scrollTop = (el.target as HTMLDivElement).scrollTop;
		const scrollHeight = (el.target as HTMLDivElement).scrollHeight;
		const clientHeight = (el.target as HTMLDivElement).clientHeight;
		$isScrolled = scrollTop > 100;
		$scrollOffset = scrollHeight - clientHeight - scrollTop;
	}

	function onClickScroll(el: HTMLElement): void {
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}

	const getConfig = async () => {
		const config = await pb.collection('config').getFullList();
		return parseConfig(config);
	};

	afterNavigate(() => {
		onClickScroll(scrollTop);
	});

	onMount(async () => {
		const loading = document.getElementById('loading-modal');
		if (loading) {
			loading.style.opacity = '0';
			setTimeout(() => {
				loading.remove();
			}, 2000);
		}
		$config = await getConfig();
	});
	let scrollTop: HTMLElement;
</script>

<header class="relative px-8">
	<Navbar
		slot="header"
		class="px-2 sm:px-4 py-2.5 absolute z-20 w-full top-0 left-0 {$isScrolled
			? 'bg-black/40'
			: 'bg-transparent'} transition-colors duration-1000"
		let:hidden
		let:toggle
	>
		<NavBrand href="/">
			<img src="/assets/logo.png" class="mx-3 h-6 sm:h-9" alt=" Logo" />
		</NavBrand>
		<NavHamburger
			on:click={toggle}
			btnClass="ml-3 md:hidden text-white hover:outline hover:outline-2 hover:outline-white hover:bg-black/40"
		/>
		<NavUl
			{activeUrl}
			{hidden}
			{activeClass}
			{nonActiveClass}
			ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium bg-black/40 outline outline-2 outline-white md:outline-none md:bg-transparent"
			on:click={toggle}
		>
			<NavLi href="/">Home</NavLi>
			<!-- <NavLi href="/contents">Contents</NavLi> -->
			<!-- <NavLi href="/challenges">Challenges</NavLi> -->
			{#if isAdmin(currentUser) || isModerator(currentUser)}
				<NavLi href="/admin/">Admin</NavLi>
			{/if}
			<NavLi href="/leaderboard/">Leaderboard</NavLi>
			{#if !!currentUser}
				<NavLi href="/logout">Logout</NavLi>
			{:else}
				<NavLi href="/login">Login</NavLi>
			{/if}
		</NavUl>
	</Navbar>
</header>
<main
	class="text-center p-0 mx-0 w-screen h-screen {$page.url.pathname === '/'
		? 'bg-transparent'
		: 'bg-black/50'} transition-colors duration-1000"
>
	<div
		class="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden"
		on:scroll={scrollDetect}
	>
		<div class="w-full h-1/6" bind:this={scrollTop} />
		<div class="min-h-[76%]">
			<slot />
		</div>
		<!-- <div class="w-full h-2" /> -->
		{#if $page.url.pathname !== '/'}
			<div class="py-4 mt-4 text-white bg-black/40">
				Made with ❤ by <a href="https://plyrs.party">Plyrs</a>
			</div>
		{/if}
	</div>
</main>
