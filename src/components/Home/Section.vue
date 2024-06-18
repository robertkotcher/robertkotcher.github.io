<template>
  <div v-if="hasSomethingToShow()" class="section">
    <h2 v-if="section.name">{{ section.name }}</h2>
    <p
      v-if="section.description"
      class="font-weight-thin"
    >
      {{ section.description }}
    </p>
    <ul
      class="items-list"
      v-for="(item, i) in section.items"
      v-bind:key="i"
      v-bind:name="item.name"
    >
      <li>
        <Item :item="item"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';

  import Item from './Item.vue';

  export default {
    name: 'Section',
    components: {
      Item
    },
    methods: {
      hasSomethingToShow() {
        if (!tagStore.state.activeTag) {
          return true;
        }

        return this.section.items.reduce((memo, item) => {
          if (item.tags.indexOf(tagStore.state.activeTag) >= 0) {
            memo = true;
          }

          return memo;
        }, false);
      }
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style scoped>
  .section {
    margin-bottom: 18px;
  }

  ul.items-list {
    padding-left: 0;
    list-style-type: none;
  }
</style>
