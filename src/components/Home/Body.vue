<template>
  <div
    id="body"
    v-if="tagStore.state.activeTag"
  >
    <FilterMessage :count="itemsByTag(sections).length" :tag="tagStore.state.activeTag"/>
    <div
      v-for="(item, i) in itemsByTag(sections)"
      v-bind:key="i"
      v-bind:name="item.name"
    >
      <div class="year" v-if="item.end">
        completed {{item.end}}:
      </div>
      <Item
        :item=item
      />
    </div>
  </div>
</template>

<script>
  import Item from './Item.vue';
  import tagStore from '../../TagStore';
  import FilterMessage from './FilterMessage';

  export default {
    name: 'Body',
    components: {
      FilterMessage,
      Item
    },
    methods: {
      itemsByTag: (sections) => {
        sections = JSON.parse(JSON.stringify(sections));
        const items = sections.reduce((memo, section) => {
          section.items.forEach(item => {
            let append = false;
            item.tags.forEach(tag => {
              if (tag == tagStore.state.activeTag) {
                append = true;
              }
            })
            if (append) memo.push(item);
          });
          return memo;
        }, []);

        // sort by year of completion
        items.sort((a, b) => {
          if (!a.end) a.end = new Date().getFullYear();
          if (!b.end) b.end = new Date().getFullYear();

          return b.end - a.end;
        });

        var lastYearSeen = null;
        items.forEach(item => {
          if (item.end != lastYearSeen && item.end != new Date().getFullYear()) {
            lastYearSeen = item.end;
          } else {
            delete item.end;
          }
        });

        return items;
      }
    },
    data: () => {
      return {
        tagStore: tagStore
      };
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
  #body {
    padding: 18px;
    width: 100%;
    max-width: 800px;
  }

  ul.sections-list {
    padding-left: 0;
    list-style-type: none;
  }

  .cluster-status-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .year {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
    font-style: italic;
    font-size: 14px;
  }
</style>
