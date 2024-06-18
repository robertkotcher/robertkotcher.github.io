<template>
  <div v-if="shouldRender()" id="travel-map">
    <img src="../../assets/travel-map.png"/>
		<div class="map-footer">
			<small>Blue denotes places that I have visited.</small>
			<small>Languages spoken: español, <a href="https://robertkotcher.github.io/blog" target="_blank">我在学习中文</a></small>
		</div>
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

	.map-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
