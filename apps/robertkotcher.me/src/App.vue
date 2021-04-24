<template>
  <v-app id="root">
    <v-sheet
      :elevation="4"
      class="root-level-content-wrapper main-padding"
    >
      <router-view/>
    </v-sheet>
  </v-app>
</template>

<script>
  export default {
    name: 'App'
  };
</script>

<style>
  #root {
    background: url(./assets/background.png);
    background-repeat: repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding: 28px;
  }

  .root-level-content-wrapper {
    max-width: 800px;
  }
  .main-padding {
    padding: 58px;
  }
  .space-before-next {
    margin-bottom: 28px;
  }

  /* This is purposefully site-wide */
  a {
    text-decoration: none !important;
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
