<script lang="ts">
    import CardLeaderboard from '$lib/components/CardLeaderboard.svelte';
    import Meta from '$lib/components/Meta.svelte'
</script>

<Meta title="Leaderboard"/>
<div class="grid w-full px-4 md:px-0 place-items-center">
    <div style="text-align: center; color: white; font-size: 64px; font-family: Karla; font-weight: 400; word-wrap: break-word">Leaderboard</div>
    <!-- <div style="width: 100%; height: 100%; padding-left: 64px; padding-right: 64px; padding-top: 4px; padding-bottom: 4px; justify-content: space-between; align-items: flex-start; display: inline-flex"> -->
    <div class="flex flex-col md:flex-row gap-2 container py-2 justify-between">
        <div class="flex gap-2">
            <!-- <div style="padding: 6px; background: white; border-radius: 6px; overflow: hidden; border: 3px white solid; justify-content: center; align-items: center; display: flex"> -->
            <div class="border-2 border-white rounded-md text-white p-2">All</div>
            <div class="border-2 border-white rounded-md text-white p-2">Circuit</div>
            <div class="border-2 border-white rounded-md text-white p-2">Drag</div>
            <div class="border-2 border-white rounded-md text-white p-2">Sprint</div>
            <div class="border-2 border-white rounded-md text-white p-2">Team Escape</div>
        </div>
        <div class="flex gap-2">
            <div class="border-2 border-white rounded-md text-white p-2">Active Race</div>
            <div class="border-2 border-white rounded-md text-white p-2">Current Race</div>
        </div>
    </div>
    <div class="container grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {#each {length: 20} as _, i}
            <CardLeaderboard />
        {/each}
    </div>
</div>