<script lang="ts">
	import { getContext } from "svelte";

    $: activeTab = getContext('activeTab')
    $: activeClass = getContext('activeClass')
    export let href = ""
    export let name = ""
</script>
<a {href} on:keydown={() => activeTab = name} on:click={() => activeTab = name}><div class="border-2 border-white rounded-md text-white p-2 {activeTab === name ? activeClass : ''}" >{name}</div></a>