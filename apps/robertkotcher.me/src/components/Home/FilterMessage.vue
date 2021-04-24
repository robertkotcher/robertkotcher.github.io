<template>
  <v-alert
    v-if="tagStore.state.activeTag"
    class="alert"
    dismissible
    color="pink"
    dark
    icon="mdi-tag"
    transition="scale-transition"
  >
    Filtering for "{{ tagStore.state.activeTag }}" items.
    <template v-slot:close>
      <v-btn text small @click="removeTag">Remove</v-btn>
    </template>
  </v-alert>
</template>

<script>
  import tagStore from '../../TagStore';

  export default {
    name: 'FilterMessage',
    methods: {
      removeTag: () => tagStore.clearActiveTag(),
    },
    data: () => {
      return {
        tagStore: tagStore
      };
    }
  }
</script>

<style scoped>
  .alert {
    position: fixed;
    top: 18px;
    right: 18px;
    width: calc(100% - 36px);
    background-color: #fff;
    z-index: 1000000;
  }
</style>
