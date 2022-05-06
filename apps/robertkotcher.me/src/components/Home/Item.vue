<template>
  <div class="item-container">
    <div class="item-text-panel">
      <h3
        v-html="item.name"
        class="font-weight-bold item-header"
      />
      <div
        v-for="(text, i) in item.description"
        :key="i"
        class="item-text"
      >
        <span v-html="text" />
      </div>
      <div class="item-tag-container">
        <Chip
          small
          secondary
          :tag=tag
          :text=tag
          v-for="(tag, i) in item.tags"
          :selected="isActiveTag(tag)"
          v-on:click="setActiveTag(tag)"
          v-bind:key="i"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';
  import Chip from '../Chip';

  export default {
    name: 'Item',
    methods: {
      setActiveTag: tag => tagStore.setActiveTag(tag),
      isActiveTag: function(tag) {
        return tag == tagStore.state.activeTag;
      },
    },
    components: {
      Chip,
    },
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style scoped>
  .item-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 28px 0;
  }

  .item-text-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .item-header {
    line-height: 1;
  }

  .item-tag-container {
    margin-top: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .item-tag {
    margin: 6px 6px 6px 0;
  }

  .item-text {
    margin: 7px 0 2px 0;
  }
</style>
