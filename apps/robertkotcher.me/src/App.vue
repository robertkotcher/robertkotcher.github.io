<template>
  <div id="root" :class="{ centered: !tagStore.state.activeTag }">
    <router-view/>
  </div>
</template>

<script>
  import tagStore from './TagStore';

  export default {
    name: 'App',
    data: () => {
      return {
        tagStore: tagStore
      };
    },
  };
</script>

<style>
  #root {
    overflow: scroll;
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 18px;
    flex-direction: column;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .centered {
    justify-content: center;
    align-items: center;
  }

  .root-level-content-wrapper {
    max-width: 960px;
  }
  .space-before-next {
    margin-bottom: 28px;
  }

  /* This is purposefully site-wide */
  a {
    text-decoration: none !important;
    color: #00e;
  }

  @media only screen and (max-width: 650px) {
    #root {
      padding: 0px;
    }

    .root-level-content-wrapper {
      padding: 16px;
      width: 100%;
    }
  }
</style>
