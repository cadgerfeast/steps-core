<script>
	export let markdown = '';
</script>

<svelte:head>
	<link rel="stylesheet" href="/static/github-markdown.css">
  <link rel="stylesheet" href="/static/prism-tomorrow.css">
</svelte:head>

<div class="markdown-body">
  {@html markdown}
</div>

<style>
</style>
