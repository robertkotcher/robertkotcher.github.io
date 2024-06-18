<template>
  <span 
    class="filter-message"
    v-if="tagStore.state.activeTag"
  >
    <span class="filter-text">Showing {{count}} results for tag <strong>{{tag}}</strong>.</span>
  </span>
</template>

<script>
  import tagStore from '../../TagStore';

  export default {
    name: 'FilterMessage',
    methods: {
      removeTag: () => tagStore.clearActiveTag(),
    },
    data: () => {
      return {
        tagStore: tagStore
      };
    },
    props: {
      tag: { type: String },
      count: { type: Number },
      sections: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped>
  .filter-message {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 18px;
  }

  .filter-text {
    margin-right: 8px;
    font-size: 12px;
  }
</style>
