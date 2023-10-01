<script lang="ts">
    import Meta from '$lib/components/Meta.svelte'
	import TabBar from '$lib/components/TabBar.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

    // let activeTab: Writable<string> = writable($page.url.pathname)
    let activeTab: string
    let activeClass: Writable<string>  = writable("/contents")
    $: activeTab = $page.url.pathname
    
    // activeTab.subscribe((value) => {
    //     console.log(`activeTab: ${value}`)
    // })

    page.subscribe((p) => {
        console.log(`page: ${p.url.pathname}`)
    })
</script>

<Meta title="Contents"/>
<div class="grid w-full px-4 md:px-0 place-items-center gap-6">
    <div class="text-white text-6xl">Contents</div>
    <TabBar bind:activeClass bind:activeTab>
        <div slot="left">
            <Tab href="/contents" name="Update" />
            <Tab href="/contents/cars" name="Cars" />
            <Tab href="/contents/vinyls" name="Vinyls" />
            <Tab href="/contents/tweaks" name="Tweaks" />
            <Tab href="/contents/others" name="Others" />
        </div>
    </TabBar>
    <div class="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <slot />
    </div>
</div>