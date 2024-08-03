<script lang="ts">
	import CardContentUpdate from '$lib/components/CardContentUpdate.svelte';
	import Meta from '$lib/components/Meta.svelte';
	const title = 'Update Title';
	const content =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In volutpat ipsum eu ante tincidunt, sed venenatis arcu luctus. Aliquam non suscipit dui, vitae malesuada erat. Mauris sapien tellus, dictum sed venenatis eget, viverra nec dolor. Aliquam eget congue purus. Aliquam dictum lacus dui, ac gravida elit vehicula eget. Sed consequat ullamcorper tortor.';
	const date = new Date();
</script>

<Meta title="Contents" />
{#each { length: 20 } as _}
	<CardContentUpdate {title} {content} {date} />
{/each}
