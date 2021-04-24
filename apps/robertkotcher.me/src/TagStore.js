import { setSingleUrlParam } from './util/url';

// As we do not need this advanced functionality, we will follow the simpler
// covention as described: https://vuejs.org/v2/guide/state-management.html#
const tagStore = {
  state: {
    activeTag: null,
    possibleTags: null,
  },
  setPossibleTags: function(sections) {
    const tags = {};

    sections.forEach(section => {
      section.items.forEach(item => {
        item.tags.forEach(tag => {
          tags[tag] = true;
        })
      })
    });

    this.state.possibleTags = Object.keys(tags).sort();
  },
  setActiveTag: function(tag) {
    setSingleUrlParam(window, { tag });
    this.state.activeTag = tag;
  },
  clearActiveTag: function() {
    setSingleUrlParam(window, {});
    this.state.activeTag = null;
  },
};

export default tagStore;
