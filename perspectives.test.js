const { createStore } = require('./perspectives');

describe('Perspectives', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      a: {
        b: 1
      },
      c: 2,
      d: [3, 4, 5, 6]
    };

    store = createStore(state);
  });

  describe('Perspective', () => {
    describe('get', () => {
      it('should get child perspective', () => {
        expect(store.get('c').toJS()).toEqual(2);
      });

      it('should be able to get objects', () => {
        expect(store.get('a').toJS()).toEqual({
          b: 1
        });
      });

      it('should be able to get arrays', () => {
        expect(store.get('d').toJS()).toEqual([3, 4, 5, 6]);
      });

      it('should chain to get nested values', () => {
        expect(
          store
            .get('a')
            .get('b')
            .toJS()
        ).toEqual(1);
      });

      it('should get elmements from inside arrays', () => {
        expect(
          store
            .get('d')
            .get(1)
            .toJS()
        ).toEqual(4);
      });
    });

    describe('set', () => {
      it('should set new value', () => {
        store.get('c').set('test');
        expect(store.get('c').toJS()).toEqual('test');
      });

      it('should propagate changes', () => {
        const selection = store.get('c');
        store.get('c').set('test');
        expect(selection.toJS()).toEqual('test');
      });

      it('should propagate changes even across methods that return copies', () => {
        const filteredArr = store.get('d').filter(elm => elm % 2);
        const sortedArr = store.get('d').sort((a, b) => b - a);
        sortedArr.get(3).set('test');
        expect(filteredArr.get(0).toJS()).toEqual('test');
      });
    });

    describe('toJS', () => {
      it('should return javascript version of number', () => {
        expect(store.get('c').toJS()).toEqual(2);
      });

      it('should return javascript version of object', () => {
        expect(store.get('a').toJS()).toEqual({ b: 1 });
      });

      it('should return javascript version of array', () => {
        expect(store.get('d').toJS()).toEqual([3, 4, 5, 6]);
      });

      it('should correctly handle undefined', () => {
        expect(createStore().toJS()).toEqual(undefined);
      });

      it('should correctly handle null', () => {
        expect(createStore(null).toJS()).toEqual(null);
      });
    });

    describe('toString', () => {
      it('should correctly handle numbers', () => {
        expect(store.get('c').toString()).toEqual('2');
      });

      it('should correctly handle objects', () => {
        expect(store.get('a').toString()).toEqual('[object Object]');
      });

      it('should correctly handle arrays', () => {
        expect(store.get('d').toString()).toEqual('3,4,5,6');
      });

      it('should correctly handle undefined', () => {
        expect(createStore().toString()).toEqual('undefined');
      });

      it('should correctly handle null', () => {
        expect(createStore(null).toString()).toEqual('null');
      });
    });
  });
});
