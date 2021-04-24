<template>
  <div v-if="shouldRender()" id="travel-map">
    <img src="../../assets/travel-map.png"/>
    <small>Blue denotes places that I have visited.</small>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';

  export default {
    name: 'WorldMap',
    methods: {
      shouldRender: function() {
        return !tagStore.state.activeTag;
      }
    }
  }
</script>

<style scoped>
  #travel-map {
    width: 100%;
  }

  img {
    width: 100%;
    border: 1px dashed #ccc;
  }
</style>
