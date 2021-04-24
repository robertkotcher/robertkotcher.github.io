<template>
  <div v-if="shouldRender()" class="item-container">
    <div class="item-image-container">
      <img
        v-if="item.image"
        :src="require(`../../assets/${item.image}`)"
        class="item-image"
      />
    </div>
    <div class="item-text-panel">
      <h3
        v-html="item.name"
        class="font-weight-bold item-header"
      />
      <div class="item-tag-container">
        <v-chip
          color="blue lighten-3"
          class="item-tag"
          label
          small
          pill
          v-for="(tag, i) in item.tags"
          v-on:click="setActiveTag(tag)"
          :key="i"
        >
          {{ tag }}
        </v-chip>
      </div>
      <div
        v-for="(text, i) in item.description"
        :key="i"
        class="item-text"
      >
        <span v-html="text" />
      </div>
    </div>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';

  export default {
    name: 'Item',
    methods: {
      setActiveTag: tag => tagStore.setActiveTag(tag),
      shouldRender: function() {
        const activeTag = tagStore.state.activeTag;

        if (activeTag) {
          const validTags = this.item.tags;
          return validTags.indexOf(activeTag) >= 0;
        } else {
          return true;
        }
      }
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

  .item-image-container {
    width: 50px;
    margin-right: 18px;
  }

  .item-image {
    width: 100%;
    object-fit: contain;
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
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .item-tag {
    margin: 6px 6px 6px 0;
  }

  .item-text {
    margin-top: 4px;
  }
</style>
