const { createStore } = require('./perspectives');

describe('Perspectives', () => {
  describe('Perspective', () => {
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

  describe('Array properties and methods', () => {
    it('should have length property', () => {
      const store = createStore([1, 2, 3]);
      expect(store.length).toEqual(3);
    });

    it('should concat arrays', () => {
      const store = createStore([1, 2, 3]);
      expect(store.concat([4, 5, 6]).toJS()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should copyWithin', () => {
      const store = createStore([1, 2, 3, 4, 5]);
      store.copyWithin(-2, -3, -1);
      expect(store.toJS()).toEqual([1, 2, 3, 3, 4]);
    });

    it('should return entries', () => {
      const store = createStore([1, 2, 3]);
      expect(store.entries().toJS()).toEqual([[0, 1], [1, 2], [2, 3]]);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should check if every value passes predicate', () => {
      const store = createStore([1, 2, 3]);
      expect(store.every(elm => elm > 0)).toBe(true);
      expect(store.every(elm => elm > 1)).toBe(false);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should fill array with the passed value', () => {
      const store = createStore([1, 2, 3]);
      store.fill('test');
      expect(store.toJS()).toEqual(['test', 'test', 'test']);
      store.fill(1, 1, 2);
      expect(store.toJS()).toEqual(['test', 1, 'test']);
    });

    it('should filter elements', () => {
      const store = createStore([1, 2, 3, 4]);
      expect(store.filter(elm => elm % 2).toJS()).toEqual([1, 3]);
      expect(store.toJS()).toEqual([1, 2, 3, 4]);
    });

    it('should find first matching element', () => {
      const store = createStore([1, 2, 3, 4]);
      expect(store.find(elm => elm > 2).toJS()).toEqual(3);
      expect(store.toJS()).toEqual([1, 2, 3, 4]);
    });

    it('should find index of first matching element', () => {
      const store = createStore([1, 2, 3, 4]);
      expect(store.findIndex(elm => elm > 2)).toEqual(2);
      expect(store.toJS()).toEqual([1, 2, 3, 4]);
    });

    it('should iterate over elements', () => {
      const store = createStore([1, 2, 3]);
      let result = 0;
      store.forEach(elm => (result += elm));
      expect(result).toEqual(6);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should check if element is included using perspective', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([1, 2, perspectiveElement, 3]);
      expect(store.includes(perspectiveElement)).toBe(true);
      expect(store.includes(perspectiveElement, 2)).toBe(true);
      expect(store.includes(perspectiveElement, 3)).toBe(false);
      expect(store.toJS()).toEqual([1, 2, 'test', 3]);
    });

    it('should return false if different perspective with matching value is included', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([1, 2, 'test', 3]);
      expect(store.includes(perspectiveElement)).toBe(false);
      expect(store.toJS()).toEqual([1, 2, 'test', 3]);
    });

    it('should check if element is included using js values', () => {
      const store = createStore([1, 2, 3]);
      expect(store.includes(2)).toBe(true);
      expect(store.includes(4)).toBe(false);
      expect(store.includes(2, 1)).toBe(true);
      expect(store.includes(2, 2)).toBe(false);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should find index of an element using perspective', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([1, 2, perspectiveElement, 3]);
      expect(store.indexOf(perspectiveElement)).toEqual(2);
      expect(store.indexOf(perspectiveElement, 2)).toEqual(2);
      expect(store.indexOf(perspectiveElement, 3)).toEqual(-1);
      expect(store.toJS()).toEqual([1, 2, 'test', 3]);
    });

    it('should not find index of different perspective with matching value', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([1, 2, perspectiveElement, 3]);
      expect(store.indexOf(createStore('test'))).toEqual(-1);
      expect(store.toJS()).toEqual([1, 2, 'test', 3]);
    });

    it('should find index of an element using js value', () => {
      const store = createStore([1, 2, 3]);
      expect(store.indexOf(2)).toEqual(1);
      expect(store.indexOf(4)).toEqual(-1);
      expect(store.indexOf(2, 1)).toEqual(1);
      expect(store.indexOf(2, 2)).toEqual(-1);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should join elements into a string using separator', () => {
      const store = createStore([1, 2, 3]);
      expect(store.join('-')).toEqual('1-2-3');
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should return an iterator over the keys', () => {
      const store = createStore([1, 2, 3]);
      let keys = [];
      for (let key of store.keys()) {
        keys.push(key);
      }
      expect(keys).toEqual([0, 1, 2]);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should find last index of an element using perspective', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([
        1,
        2,
        perspectiveElement,
        perspectiveElement,
        3
      ]);
      expect(store.lastIndexOf(perspectiveElement)).toEqual(3);
      expect(store.lastIndexOf(perspectiveElement, 2)).toEqual(2);
      expect(store.toJS()).toEqual([1, 2, 'test', 'test', 3]);
    });

    it('should not find last index of different perspective with matching value', () => {
      const perspectiveElement = createStore('test');
      const store = createStore([1, 2, perspectiveElement, 3]);
      expect(store.lastIndexOf(createStore('test'))).toEqual(-1);
      expect(store.toJS()).toEqual([1, 2, 'test', 3]);
    });

    it('should find last index of an element using js value', () => {
      const store = createStore([1, 2, 2, 3]);
      expect(store.lastIndexOf(2)).toEqual(2);
      expect(store.lastIndexOf(2, 1)).toEqual(1);
      expect(store.toJS()).toEqual([1, 2, 2, 3]);
    });

    it('should map a function over the elements', () => {
      const store = createStore([1, 2, 3]);
      expect(store.map(elm => elm * 2)).toEqual([2, 4, 6]);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should pop an element', () => {
      const store = createStore([1, 2, 3]);
      expect(store.pop().toJS()).toEqual(3);
      expect(store.toJS()).toEqual([1, 2]);
    });

    it('should push an element', () => {
      const store = createStore([1, 2, 3]);
      expect(store.push('test')).toEqual(4);
      expect(store.toJS()).toEqual([1, 2, 3, 'test']);
    });

    it('should reduce values', () => {
      const store = createStore([1, 2, 3]);
      expect(store.reduce((acc, curr) => acc + curr, 0)).toEqual(6);
      expect(store.toJS()).toEqual([1, 2, 3]);
    });

    it('should reduce values from the right', () => {
      const store = createStore([1, 2, 4]);
      expect(store.reduceRight((acc, curr) => acc / curr, 32)).toEqual(4);
      expect(store.toJS()).toEqual([1, 2, 4]);
    });

    it('should reverse elements', () => {
      const store = createStore([1, 2, 3]);
      expect(store.reverse().toJS()).toEqual([3, 2, 1]);
      expect(store.toJS()).toEqual([3, 2, 1]);
    });

    it('should shift an element', () => {
      const store = createStore([1, 2, 3]);
      expect(store.shift().toJS()).toEqual(1);
      expect(store.toJS()).toEqual([2, 3]);
    });

    it('should slice the elements', () => {
      const store = createStore([1, 2, 3, 4]);
      expect(store.slice(1, 3).toJS()).toEqual([2, 3]);
      expect(store.toJS()).toEqual([1, 2, 3, 4]);
    });

    it('should return true if some elements meet the predicate', () => {
      const store = createStore([1, 2, 3, 4]);
      expect(store.some(elm => elm.toJS() === 2)).toEqual(true);
      expect(store.some(elm => elm.toJS() > 4)).toEqual(false);
      expect(store.toJS()).toEqual([1, 2, 3, 4]);
    });

    it('should sort the elements using the default compareFunction', () => {
      const store = createStore(['one', 'two', 'three']);
      expect(store.sort().toJS()).toEqual(['one', 'three', 'two']);
      expect(store.toJS()).toEqual(['one', 'three', 'two']);
    });

    it('should sort the elements using a custom compareFunction', () => {
      const store = createStore(['one', 'two', 'three']);
      expect(
        store.sort((a, b) => b.toJS().length - a.toJS().length).toJS()
      ).toEqual(['three', 'one', 'two']);
      expect(store.toJS()).toEqual(['three', 'one', 'two']);
    });

    it('should splice the elements', () => {
      const store = createStore(['Jan', 'March', 'April', 'June']);
      expect(store.splice(1, 0, 'Feb').toJS()).toEqual([]);
      expect(store.toJS()).toEqual(['Jan', 'Feb', 'March', 'April', 'June']);
      expect(store.splice(4, 1, 'May').toJS()).toEqual(['June']);
      expect(store.toJS()).toEqual(['Jan', 'Feb', 'March', 'April', 'May']);
    });

    it('should unshift an element', () => {
      const store = createStore([1, 2, 3]);
      expect(store.unshift(0)).toEqual(4);
      expect(store.toJS()).toEqual([0, 1, 2, 3]);
    });

    it('should return values as an iterator', () => {
      const store = createStore([1, 2, 3]);
      const iter = store.values();
      const results = [];
      for (val of iter) {
        results.push(val.toJS());
      }
      expect(results).toEqual([1, 2, 3]);
    });

    it('should be iterable', () => {
      const store = createStore([1, 2, 3]);
      const results = [];
      for (val of store) {
        results.push(val.toJS());
      }
      expect(results).toEqual([1, 2, 3]);
    });
  });

  describe('String properties and methods', () => {
    it('should return character at index', () => {
      const store = createStore('test');
      expect(store.charAt(1)).toEqual('e');
      expect(store.toJS()).toEqual('test');
    });

    it('should return charCode at index', () => {
      const store = createStore('test');
      expect(store.charCodeAt(1)).toEqual(101);
      expect(store.toJS()).toEqual('test');
    });

    it('should return codePoint at index', () => {
      const store = createStore('test');
      expect(store.codePointAt(1)).toEqual(101);
      expect(store.toJS()).toEqual('test');
    });

    it('should concatenate strings', () => {
      const store = createStore('test');
      expect(store.concat('ing').toJS()).toEqual('testing');
      expect(store.toJS()).toEqual('test');
    });

    it('should check whether a string ends with a particular subString', () => {
      const store = createStore('test');
      expect(store.endsWith('st')).toBe(true);
      expect(store.endsWith('ab')).toBe(false);
      expect(store.toJS()).toEqual('test');
    });

    it('should check whether string includes particular subString', () => {
      const store = createStore('test');
      expect(store.includes('es')).toBe(true);
      expect(store.includes('ab')).toBe(false);
      expect(store.includes('es', 1)).toBe(true);
      expect(store.includes('es', 2)).toBe(false);
      expect(store.toJS()).toEqual('test');
    });

    it('should return index of a subString', () => {
      const store = createStore('test');
      expect(store.indexOf('es')).toEqual(1);
      expect(store.indexOf('ab')).toEqual(-1);
      expect(store.indexOf('es', 1)).toBe(1);
      expect(store.indexOf('es', 2)).toBe(-1);
      expect(store.toJS()).toEqual('test');
    });

    it('should return last index of a subString', () => {
      const store = createStore('test');
      expect(store.lastIndexOf('t')).toEqual(3);
      expect(store.lastIndexOf('ab')).toEqual(-1);
      expect(store.lastIndexOf('t', 3)).toEqual(3);
      expect(store.lastIndexOf('t', 2)).toEqual(0);
      expect(store.toJS()).toEqual('test');
    });

    it('should match regexp', () => {
      const store = createStore('test');
      expect(store.match(/[a-z]/g)).toEqual(['t', 'e', 's', 't']);
      expect(store.toJS()).toEqual('test');
    });

    it('should normalize string', () => {
      const store = createStore('\u1E9B\u0323');
      expect(store.normalize('NFD')).toEqual('\u017F\u0323\u0307');
      expect(store.toJS()).toEqual('\u1E9B\u0323');
    });

    it('should pad the end of the string', () => {
      const store = createStore('test');
      expect(store.padEnd(8, '!')).toEqual('test!!!!');
      expect(store.toJS()).toEqual('test');
    });

    it('should pad the start of the string', () => {
      const store = createStore('test');
      expect(store.padStart(8, '!')).toEqual('!!!!test');
      expect(store.toJS()).toEqual('test');
    });

    it('should the string', () => {
      const store = createStore('test');
      expect(store.repeat(3)).toEqual('testtesttest');
      expect(store.toJS()).toEqual('test');
    });

    it('should replace parts of the string', () => {
      const store = createStore('test');
      expect(store.replace(/t/g, 'a')).toEqual('aesa');
      expect(store.toJS()).toEqual('test');
    });

    it('should return index of first match', () => {
      const store = createStore('test');
      expect(store.search('s')).toEqual(2);
      expect(store.search('z')).toEqual(-1);
      expect(store.toJS()).toEqual('test');
    });

    it('should return a slice of the original string', () => {
      const store = createStore('test');
      expect(store.slice(1, 3).toJS()).toEqual('es');
      expect(store.toJS()).toEqual('test');
    });

    it('should split the string', () => {
      const store = createStore('1,2,3,4');
      expect(store.split(',', 3)).toEqual(['1', '2', '3']);
      expect(store.toJS()).toEqual('1,2,3,4');
    });

    it('should determine whether string starts with the specified substring', () => {
      const store = createStore('test');
      expect(store.startsWith('te')).toBe(true);
      expect(store.startsWith('te', 1)).toBe(false);
      expect(store.startsWith('zz')).toBe(false);
      expect(store.toJS()).toEqual('test');
    });

    it('should return a substring', () => {
      const store = createStore('test');
      expect(store.substring(1, 3)).toEqual('es');
      expect(store.toJS()).toEqual('test');
    });

    it('should return locale appropriate lower case string', () => {
      const store = createStore('TesT');
      expect(store.toLocaleLowerCase()).toEqual('test');
      expect(store.toJS()).toEqual('TesT');
    });

    it('should return locale appropriate upper case string', () => {
      const store = createStore('TesT');
      expect(store.toLocaleUpperCase()).toEqual('TEST');
      expect(store.toJS()).toEqual('TesT');
    });

    it('should convert to lower case', () => {
      const store = createStore('TesT');
      expect(store.toLowerCase()).toEqual('test');
      expect(store.toJS()).toEqual('TesT');
    });

    it('should convert to upper case', () => {
      const store = createStore('TesT');
      expect(store.toUpperCase()).toEqual('TEST');
      expect(store.toJS()).toEqual('TesT');
    });

    it('should remove whitespace from both ends of the string', () => {
      const store = createStore('    testing, testing    ');
      expect(store.trim()).toEqual('testing, testing');
      expect(store.toJS()).toEqual('    testing, testing    ');
    });

    it('should remove whitespace from just the end of the string', () => {
      const store = createStore('    testing, testing    ');
      expect(store.trimEnd()).toEqual('    testing, testing');
      expect(store.trimRight()).toEqual('    testing, testing');
      expect(store.toJS()).toEqual('    testing, testing    ');
    });

    it('should remove whitespace from just the start of the string', () => {
      const store = createStore('    testing, testing    ');
      expect(store.trimStart()).toEqual('testing, testing    ');
      expect(store.trimLeft()).toEqual('testing, testing    ');
      expect(store.toJS()).toEqual('    testing, testing    ');
    });
  });
});
