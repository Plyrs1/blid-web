<script lang="ts">
    import Meta from '$lib/components/Meta.svelte'
    import CardChallenge from '$lib/components/CardChallenge.svelte';
	import CardChallengeAlt from '$lib/components/CardChallengeAlt.svelte';
</script>

<Meta title="Race Challenges"/>
<div class="grid w-full px-4 md:px-0 place-items-center">
    <div style="text-align: center; color: white; font-size: 64px; font-family: Karla; font-weight: 400; word-wrap: break-word">Challenges</div>
    <div class="container grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {#each {length: 20} as _, i}
            <CardChallenge />
        {/each}
    </div>
</div>