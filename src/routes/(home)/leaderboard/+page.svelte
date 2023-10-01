<script lang="ts">
	import { page } from '$app/stores';
    import CardLeaderboard from '$lib/components/CardLeaderboard.svelte';
    import Meta from '$lib/components/Meta.svelte'
	import Tab from '$lib/components/Tab.svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import { writable, type Writable } from 'svelte/store';
    let activeTab: string
    let activeClass: Writable<string>  = writable("/leaderboard")
    $: activeTab = $page.url.pathname
</script>

<Meta title="Leaderboard"/>
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
    <div class="container grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {#each {length: 20} as _, i}
            <CardLeaderboard />
        {/each}
    </div>
</div>