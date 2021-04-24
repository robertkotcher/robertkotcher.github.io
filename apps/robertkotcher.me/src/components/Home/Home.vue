<template>
  <div>
    <FilterMessage/>
    <Header/>
    <Body :sections="sections"/>
    <WorldMap/>
  </div>
</template>

<script>
  import sections from '../../sections/sections.json';

  import TagStore from '../../TagStore';
  import { getUrlParams } from '../../util/url';

  import FilterMessage from './FilterMessage.vue';
  import Header from './Header.vue';
  import Body from './Body.vue';
  import WorldMap from './WorldMap.vue';

  TagStore.setPossibleTags(sections);

  const urlParams = getUrlParams(window);
  if (urlParams.tag) {
    TagStore.setActiveTag(window.decodeURI(urlParams.tag));
  }

  export default {
    name: 'Home',
    components: {
      FilterMessage,
      Header,
      Body,
      WorldMap,
    },
    data: () => {
      return {
        sections: sections,
      };
    }
  };
</script>
