<template>
    <span
      :class="{ chip: true, primary, secondary, selected, small }"
    >
      <a :class="{ primary, secondary }" :href="generateLink(tag)">
      {{text}}
      </a>
    </span>
</template>

<script>
  import tagStore from '../TagStore';

  export default {
    name: 'Chip',
    props: {
      text: { type: String },
      tag: { type: String },
      url: { type: String },
      primary: { type: Boolean },
      secondary: { type: Boolean },
      selected: { type: Boolean },
      small: { type: Boolean },
    },
    methods: {
      setTag: function(tag) {
        tagStore.setActiveTag(tag);
      },
      generateLink: function(tag) {
        return "/?tag=" + tag;
      },
    },
  };
</script>

<style scoped>
    .primary {
        background-color: #4caf50 !important;
        color: white;
        filter: brightness(1);
    }
    .secondary {
        background-color: #dedede !important;
        color: #444;
        filter: brightness(1);
    }
    .selected {
      filter: brightness(0.75);
    }
    .chip {
        margin: 9px 9px 9px 0;
        font-size: 18px;
        padding: 12px 16px;
        border-radius: 28px;
        cursor: pointer;
    }
    .small {
      font-size: 12px;
      margin: 0px;
      margin-right: 4px;
      padding: 5px 6px;
      border-radius: 5px;
    }
</style>
