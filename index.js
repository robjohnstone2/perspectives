const { createStore } = require('./perspectives');
const state = {
  a: {
    b: 1
  },
  c: 2,
  d: [3, 4, 5]
};

const store = createStore(state);

console.log(store.toJS());
