<template>
  <div id="post-wrapper">
    <!-- px-0 is a Material Design formatted classname -->
    <v-breadcrumbs class="px-0" :items="items"/>
    <router-view/>
  </div>
</template>

<script>
  function convertSlugToTitle(slug) {
    return slug
      .replace(/_|-/g, ' ')
      .replace(/(^|\s)\S/g, t => t.toUpperCase());
  }

  export default {
    name: 'PostWrapper',
    data: function() {
      const slug = this.$route.path.split('/').pop();

      return {
        items: [
          { text: 'Home', link: true, href: '/' },
          { text: convertSlugToTitle(slug), disabled: true }
        ]
      }
    }
  };
</script>

<style>
	#post-wrapper p {
		margin: 12px 0;
	}
</style>
