const isObject = val => val === Object(val);

const assertArray = (arr, methodName) => {
  if (!Array.isArray(arr)) {
    throw TypeError(
      `${methodName} method can only by used on Perspectives that contain arrays. This contains a ${typeof this
        .__data}.`
    );
  }
};

class Perspective {
  constructor(data) {
    if (data instanceof Perspective) {
      return data;
    }
    this.set(data);
  }

  set(data) {
    if (Array.isArray(data)) {
      this.__data = data.map(elm => new Perspective(elm));
    } else if (isObject(data)) {
      this.__data = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = new Perspective(value);
        return acc;
      }, {});
    } else {
      this.__data = data;
    }
    return this;
  }

  get(key) {
    return this.__data[key];
  }

  toJS() {
    if (Array.isArray(this.__data)) {
      return this.__data.map(elm => elm.toJS());
    } else if (isObject(this.__data)) {
      return Object.entries(this.__data).reduce((acc, [key, value]) => {
        acc[key] = value.toJS();
        return acc;
      }, {});
    } else {
      return this.__data;
    }
  }

  toString() {
    const value = this.toJS();
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    return value.toString();
  }

  valueOf() {
    return this.toJS();
  }

  // Array methods
  concat(...values) {
    assertArray(this.__data, 'concat');
    return new Perspective([].concat(this.__data, ...values));
  }

  copyWithin(target, start, end) {
    assertArray(this.__data, 'copyWithin');
    this.__data.copyWithin(target, start, end);
    return this;
  }

  entries() {
    assertArray(this.__data, 'entries');
    return new Perspective(this.__data.map((elm, i) => [i, elm]));
  }

  every(predicate) {
    assertArray(this.__data, 'entries');
    return this.__data.every(predicate);
  }

  fill(value, start, end) {
    assertArray(this.__data, 'fill');
    this.__data.fill(new Perspective(value), start, end);
    return this;
  }

  filter(predicate) {
    assertArray(this.__data, 'filter');
    return new Perspective(
      this.__data.filter((elm, i, arr) => predicate(elm, i, arr))
    );
  }

  find(predicate) {
    assertArray(this.__data, 'find');
    return new Perspective(
      this.__data.find((elm, i, arr) => predicate(elm.__data, i, arr))
    );
  }

  findIndex(predicate) {
    assertArray(this.__data, 'findIndex');
    return this.__data.findIndex((elm, i, arr) =>
      predicate(elm.__data, i, arr)
    );
  }

  forEach(fn) {
    assertArray(this.__data, 'forEach');
    this.__data.forEach(fn);
  }

  includes(value) {
    assertArray(this.__data, 'includes');
    if (value instanceof Perspective) {
      return !!this.__data.includes(value);
    }
    return !!this.__data.find(elm => elm.toJS() === value);
  }

  indexOf(value) {
    assertArray(this.__data, 'indexOf');
    if (value instanceof Perspective) {
      return this.__data.indexOf(value);
    }
    return this.__data.slice(0).reduce((acc, elm, i, arr) => {
      if (elm.toJS() === value) {
        arr.splice(1);
        return i;
      }
      return acc;
    }, -1);
  }

  join(sep) {
    assertArray(this.__data, 'join');
    return this.__data.map(elm => elm.toString()).join(sep);
  }

  keys() {
    // note returns an array rather than a Perspective as there is no context
    assertArray(this.__data, 'keys');
    return this.__data.keys();
  }

  lastIndexOf(value) {
    assertArray(this.__data, 'lastIndexOf');
    if (value instanceof Perspective) {
      return this.__data.lastIndexOf(value);
    }
    return this.__data.reduce((acc, elm, i) => {
      if (elm.toJS() === value) {
        return i;
      }
      return acc;
    }, -1);
  }

  map(cb, thisArg) {
    // note returns an array rather than a Perspective as context likely to be destroyed by cb
    assertArray(this.__data, 'map');
    return this.__data.map(cb, thisArg);
  }

  pop() {
    assertArray(this.__data, 'pop');
    return this.__data.pop();
  }

  push(...values) {
    assertArray(this.__data, 'push');
    return this.__data.push(...values.map(value => new Perspective(value)));
  }

  reduce(reducer, initialValue) {
    assertArray(this.__data, 'reduce');
    return this.__data.reduce(reducer, initialValue);
  }

  reduceRight(reducer, initialValue) {
    assertArray(this.__data, 'reduceRight');
    return this.__data.reduceRight(reducer, initialValue);
  }

  reverse() {
    assertArray(this.__data, 'reverse');
    this.__data.reverse();
    return this;
  }

  shift() {
    assertArray(this.__data, 'shift');
    return this.__data.shift();
  }

  slice(begin, end) {
    assertArray(this.__data, 'slice');
    return new Perspective(this.__data.slice(begin, end));
  }

  some(predicate) {
    assertArray(this.__data, 'some');
    return this.__data.some((elm, i, arr) => predicate(elm, i, arr));
  }

  sort(compareFunction) {
    assertArray(this.__data, 'sort');
    compareFunction =
      compareFunction ||
      ((a, b) => {
        const aJs = a.toJS();
        const bJs = b.toJS();
        if (aJs === undefined && bJs === undefined) return 0;
        if (aJs === undefined) return 1;
        if (bJs === undefined) return -1;
        const aString = a.toString();
        const bString = b.toString();
        if (aString < bString) return -1;
        if (aString > bString) return 1;
        return 0;
      });
    return new Perspective(this.__data.sort((a, b) => compareFunction(a, b)));
  }

  splice(start, deleteCount, ...items) {
    assertArray(this.__data, 'splice');
    const itemPerspectives = items.map(item => new Perspective(item));
    return new Perspective(
      this.__data.splice(start, deleteCount, ...itemPerspectives)
    );
  }

  toLocaleString(...args) {
    assertArray(this.__data, 'toLocaleString');
    return this.toJS().toLocaleString(...args);
  }

  unshift(...values) {
    assertArray(this.__data, 'unshift');
    return this.__data.unshift(...values.map(value => new Perspective(value)));
  }

  values() {
    assertArray(this.__data, 'values');
    return this.__data.values();
  }

  [Symbol.iterator]() {
    assertArray(this.__data, '[Symbol.iterator]');
    return this.values();
  }
}

const createStore = data => new Perspective(data);

module.exports = { Perspective, createStore };
