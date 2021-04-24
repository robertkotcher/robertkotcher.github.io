<template>
  <div id="body">
    <ul
      class="sections-list"
      v-for="(section, i) in sections"
      v-bind:key="i"
      v-bind:name="section.name"
    >
      <li>
        <Section :section="section"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import Section from './Section.vue';

  export default {
    name: 'Body',
    components: {
      Section
    },
    props: {
      sections: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style scoped>
  ul.sections-list {
    padding-left: 0;
    list-style-type: none;
  }

  .cluster-status-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>
