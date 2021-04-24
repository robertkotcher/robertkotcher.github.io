<template>
  <div id="header">
    <img class="header-image" src="../../assets/profile.png"/>
    <div class="header-text-panel">
      <h1 class="header-title">
          Robert Kotcher
      </h1>
      <small class="text--secondary font-italic">
        rkotcher [at] gmail [dot] com
      </small>
      <div class="text--secondary header-text">
        Software, machine learning, startups -- I fixate on the "why" and then choose the simplest "how" that makes sense.
      </div>
      <v-autocomplete
        :value="getValue()"
        :items="getTags()"
        @change="setTag"
        filled
        label="Filter by tag"
     ></v-autocomplete>
    </div>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';

  export default {
    name: 'Header',
    methods: {
      getValue: function() {
        return tagStore.state.activeTag;
      },
      getTags: function() {
        return tagStore.state.possibleTags;
      },
      setTag: function(tag) {
        tagStore.setActiveTag(tag);
      },
    },
  }
</script>

<style scoped>
  #header {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .header-image {
    width: 120px;
    margin-right: 18px;
    object-fit: contain;
  }

  .header-text-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .header-text {
    margin: 12px 0;
  }

  .header-title {
    white-space: nowrap;
  }
</style>
