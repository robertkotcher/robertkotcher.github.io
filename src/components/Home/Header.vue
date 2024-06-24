<template>
  <div id="header">
    <div class="chip-container-small" v-if="tagStore.state.activeTag">
      <a href="/" class="header-title-small">Robert Kotcher</a>
      <Chip small primary tag="projects (past year)" text="projects (past year)" :selected="isActiveTag('projects')"/>
      <Chip small primary tag="education" text="education" :selected="isActiveTag('education')"/>
      <Chip small primary tag="startups" text="startups" :selected="isActiveTag('startups')"/>
      <Chip small primary tag="travel" text="travel" :selected="isActiveTag('languages')"/>
      <Chip small secondary tag="archived projects" text="archived projects" :selected="isActiveTag('archived projects')"/>
    </div>
    <div class="header-container" v-if="!tagStore.state.activeTag">
      <div class="image-panel animation-panel-first">
        <img src="../../assets/home-minified.jpg"/>
      </div>
      <div class="intro-panel animation-panel-second">
        <div class="header-title">Robert Kotcher</div>
        <p class="header-text">
          Computers, lean startup methodology, travel, sushi.
        </p>
        <div class="link-container">
          <a target="_blank" href="https://huggingface.co/rkotcher"><img src="../../assets/hf.png" class="header-link"/></a>
          <a target="_blank" href="https://github.com/robertkotcher"><img src="../../assets/gh.png" class="header-link"/></a>
          <a target="_blank" href="https://www.linkedin.com/in/robert-kotcher-639105196/"><img src="../../assets/li.png" class="header-link"/></a>
        </div>
        <div class="chip-container">
          <Chip primary tag="projects (past year)" text="projects (past year)"/>
          <Chip primary tag="education" text="education"/>
          <Chip primary tag="startups" text="startups"/>
          <Chip primary tag="travel" text="travel"/>
          <Chip secondary tag="archived projects" text="archived projects"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tagStore from '../../TagStore';
  import Chip from '../Chip';

  export default {
    name: 'Header',
    methods: {
      setTag: function(tag) {
        tagStore.setActiveTag(tag);
      },
      isActiveTag: function(tag) {
        return tag == tagStore.state.activeTag;
      },
    },
    data: () => {
      return {
        tagStore: tagStore
      };
    },
    components: {
      Chip,
    },
  }
</script>

<style scoped>
  #header {
    margin: 18px;
    max-width: 960px;
  }

  .header-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .animation-panel-first {
    animation-name: fadeIn;
    animation-duration: 750ms;
    animation-fill-mode: forwards;
  }

  .animation-panel-second {
    animation-name: fadeIn;
    animation-delay: 100ms;
    animation-duration: 1250ms;
    animation-fill-mode: forwards;
  }

  .animation-panel-third {
    animation-name: fadeIn;
    animation-delay: 250ms;
    animation-duration: 1500ms;
    animation-fill-mode: forwards;
  }

  .left-panel {
    width: 200px;
    margin-right: 18px;
    opacity: 0;
  }

  .chip-container {
    max-width: 500px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 12px 0;
    width: 100%;
  }

  .chip-container-small {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    margin: 8px 0;
    width: 100%;
    height: 38px;
  }

  .link-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .link-container > a {
    margin: 0 8px;
  }
  
  .image-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
  }

  .image-panel img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }

  .intro-panel {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
  }


  @media only screen and (max-width: 600px) {
    .header-container {
      display: flex;
      flex-direction: column;
    }

    .image-panel {
      position: relative;
      left: initial;
      top: initial;
      width: 100%;
    }

    .image-panel img {
      position: relative;
      top: initial;
      left: initial;
      width: 100%;
      transform: initial;
      object-fit: cover;
      margin-bottom: 18px;
    }

    .intro-panel {
      position: relative;
      left: initial;
      top: initial;
      width: 100%;
    }

    .link-container {
      margin-bottom: 12px;
    }
  }

  .header-title {
    text-align: center;
    font-size: 50px;
    font-weight: 500;
    line-height: 1;
  }

  .header-title-small {
    margin-right: 8px;
    color: black;
    text-decoration: none;
    font-size: 24px;
    font-weight: 500;
    line-height: 1;
  }  

  .header-text {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 80%;
    font-size: 20px;
    text-align: center;
    padding: 0 8px;
  }

  .header-link {
    width: 32px;
    height: 32px;
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    opacity: 0;
  }

  .intro-table {
    font-size: 26px;
  }

  .upper-col {
    padding: 0px 10px 10px 0;    
  }

  .inner-col {
    padding: 10px 10px 10px 0;
    vertical-align: top;
    line-height: 1.2;
  }

  .emoji-col {
    width: 38px;
  }

  .outer-col {
    line-height: 1;
  }

  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-moz-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-webkit-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-o-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-ms-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
</style>
