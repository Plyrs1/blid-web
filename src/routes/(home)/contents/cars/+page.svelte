<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";

    onMount(() => {
        console.log($page.data.title);
    })
</script>

<div>
    <p >Test</p>
    Content

</div>