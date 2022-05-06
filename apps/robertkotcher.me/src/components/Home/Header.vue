<template>
  <div id="header">
    <div class="chip-container-small" v-if="tagStore.state.activeTag">
      <a href="/" class="header-title-small">Robert Kotcher</a>
      <Chip small primary tag="learning" text="learning 📄" :selected="isActiveTag('learning')"/>
      <Chip small primary tag="industry" text="industry" :selected="isActiveTag('industry')"/>
      <Chip small primary tag="languages" text="idiomas / 语言" :selected="isActiveTag('languages')"/>
      <Chip small secondary tag="old" text="old" :selected="isActiveTag('old')"/>
    </div>
    <div class="header-container" v-if="!tagStore.state.activeTag">
        <div class="left-panel"></div>
        <div class="right-panel animation-panel-second">
          <table class="intro-table">
            <tr>
              <td class="outer-col emoji-col"></td>
              <td class="outer-col"><div class="header-title">Robert Kotcher</div></td>
            </tr>
          </table>
        </div>
    </div>
    <div class="header-container" v-if="!tagStore.state.activeTag">
      <div class="left-panel image-panel animation-panel-first"></div>
      <div class="right-panel animation-panel-second">
        <table class="intro-table">
          <tr>
            <td class="upper-col emoji-col">👋</td>
            <td class="upper-col">Welcome to my website!</td>
          </tr>
          <tr>
            <td class="inner-col emoji-col">🌱</td>
            <td class="inner-col">My favorite things are travelling, <a href="https://blog.robertkotcher.me" target="_blank">learning languages</a>, and <a href="/?tag=learning" target="_blank">learning new technical skills</a>.</td>
          </tr>
          <tr>
            <td class="inner-col emoji-col">🎓</td>
            <td class="inner-col">I'm a Carnegie Mellon alumni (computer science and music).</td>
          </tr>          
          <tr>
            <td class="outer-col emoji-col">💼</td>
            <td class="outer-col">You can learn more about my work experiences <a href="/?tag=industry" target="_blank">here</a>.</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="header-container" v-if="!tagStore.state.activeTag">
      <div class="left-panel"></div>
      <div class="right-panel animation-panel-third">
        <table class="intro-table">
          <tr>
            <td class="outer-col emoji-col"></td>
            <td class="outer-col">
              <div class="chip-container">
                <Chip primary tag="learning" text="learning 📄"/>
                <Chip primary tag="industry" text="industry"/>
                <Chip primary tag="languages" text="idiomas / 语言"/>
                <Chip secondary tag="old" text="old"/>
              </div>
            </td>
          </tr>
        </table>
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
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    margin: 12px 0;
    width: 100%;
    height: 50px;
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

  @media only screen and (max-width: 550px) {
    .left-panel {
      display: none;
    }
  }

  .image-panel {
    background: url(../../assets/profile.jpg);
    background-size: cover;
    background-position: 50% 0;
  }

  .header-title {
    margin-bottom: 12px;
    white-space: nowrap;
    font-size: 38px;
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
