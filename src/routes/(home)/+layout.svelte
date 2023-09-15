<script lang="ts">
	import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
    import { isScrolled, scrollOffset } from '$lib/stores/page'
    import { afterNavigate } from "$app/navigation";

    $: activeUrl = $page.url.pathname;
    
    let activeClass = 'text-white font-bold';
    let nonActiveClass = 'text-white';
    function scrollDetect(el: Event): void {
        const scrollTop = (el.target as HTMLDivElement).scrollTop
        const scrollHeight = (el.target as HTMLDivElement).scrollHeight
        const clientHeight = (el.target as HTMLDivElement).clientHeight
        $isScrolled = scrollTop > 100
        $scrollOffset = scrollHeight - clientHeight - scrollTop
        // console.log(`isScrolled: ${$isScrolled} scrollOffset: ${$scrollOffset}`)
    }
    function onClickScroll(el: HTMLElement): void {
        el.scrollIntoView({
        behavior: 'smooth'
        })
    }
    afterNavigate(() => {
        onClickScroll(scrollTop)
    })
    
    let scrollTop: HTMLElement
</script>

<header class="relative px-8">
    <Navbar slot="header" navClass="px-2 sm:px-4 py-2.5 absolute z-20 w-full top-0 left-0 {$isScrolled ? 'bg-black/40' : 'bg-transparent'} transition-colors duration-1000" let:hidden let:toggle>
        <NavBrand href="/">
        <img
            src="/assets/logo.png"
            class="mr-3 h-6 sm:h-9"
            alt=" Logo"
        />
        </NavBrand>
        <NavHamburger on:click={toggle} btnClass="ml-3 md:hidden text-white hover:outline hover:outline-2 hover:outline-white hover:bg-black/40"  />
        <NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass} ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium bg-black/40 outline outline-2 outline-white md:outline-none md:bg-transparent" on:click="{toggle}">
            <NavLi href="/">Home</NavLi>
            <NavLi href="/contents">Contents</NavLi>
            <NavLi href="/challenges">Challenges</NavLi>
            <NavLi href="/leaderboard">Leaderboard</NavLi>
            <NavLi href="/admin">Admin</NavLi>
        </NavUl>
    </Navbar>
</header>
<main class="text-center p-0 mx-0 w-screen h-screen {$page.route.id === '/' ? 'bg-transparent' : 'bg-black/50'} transition-colors duration-1000">
    <div class="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden" on:scroll={scrollDetect}>
        <div class="w-full h-1/6" bind:this={scrollTop} />
            <slot />
        <div class="w-full h-1/6" />
    </div>
</main>

