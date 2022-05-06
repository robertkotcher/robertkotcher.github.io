import { setSingleUrlParam } from './util/url';

// As we do not need this advanced functionality, we will follow the simpler
// covention as described: https://vuejs.org/v2/guide/state-management.html#
const tagStore = {
  state: {
    activeTag: null,
    possibleTags: null,
    tagCounts: {},
  },
  setPossibleTags: function(sections) {
    var tags = {};

    sections.forEach(section => {
      section.items.forEach(item => {
        item.tags.forEach(tag => {
          if (tags[tag]) {
            tags[tag] += 1;
          } else {
            tags[tag] = 1;
          }
        })
      })
    });

    this.state.possibleTags = Object.keys(tags).sort((a, b) => {
      return tags[b] - tags[a];
    });
    this.state.tagCounts = tags;
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
