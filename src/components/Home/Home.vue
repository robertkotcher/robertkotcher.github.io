<template>
  <div>
    <Header/>
    <Body
      v-if="tagStore.state.activeTag"
      :sections="sections"
    />
  </div>
</template>

<script>
  import sections from '../../sections/sections.json';

  import TagStore from '../../TagStore';  
  import { getUrlParams } from '../../util/url';

  import Header from './Header.vue';
  import Body from './Body.vue';

  TagStore.setPossibleTags(sections);

  const urlParams = getUrlParams(window);
  if (urlParams.tag) {
    TagStore.setActiveTag(window.decodeURI(urlParams.tag));
  }

  export default {
    name: 'Home',
    components: {
      Header,
      Body,
    },
    data: () => {
      return {
        sections: sections,
        tagStore: TagStore,
      };
    },
  };
</script>
