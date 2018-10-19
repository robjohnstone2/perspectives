const isObject = val => val === Object(val);

const assertArray = (arr, methodName) => {
  if (!Array.isArray(arr)) {
    throw TypeError(
      `${methodName} method can only by used on Perspectives that contain arrays. This one contains a ${typeof arr}.`
    );
  }
};

const assertString = (str, methodName) => {
  if (typeof str !== 'string') {
    throw TypeError(
      `${methodName} method can only by used on Perspectives that contain strings. This one contains a ${typeof str}.`
    );
  }
};

const assertArrayOrString = (data, methodName) => {
  if (!Array.isArray(data) && typeof data !== 'string') {
    throw TypeError(
      `${methodName} method can only by used on Perspectives that contain arrays or strings. This one contains a ${typeof data}.`
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

  join(sep) {
    assertArray(this.__data, 'join');
    return this.__data.map(elm => elm.toString()).join(sep);
  }

  keys() {
    // note returns an array rather than a Perspective as there is no context
    assertArray(this.__data, 'keys');
    return this.__data.keys();
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

  // String properties and methods
  charAt(index) {
    assertString(this.__data, 'charAt');
    return this.__data.charAt(index);
  }

  charCodeAt(index) {
    assertString(this.__data, 'charCodeAt');
    return this.__data.charCodeAt(index);
  }

  codePointAt(index) {
    assertString(this.__data, 'codePointAt');
    return this.__data.codePointAt(index);
  }

  endsWith(str) {
    assertString(this.__data, 'endsWith');
    return this.__data.endsWith(str);
  }

  localeCompare(compareString, locales, options) {
    assertString(this.__data, 'localeCompare');
    if (compareString instanceof Perspective) {
      return this.__data.localeCompare(compareString.toJS(), locales, options);
    }
    return this.__data.localeCompare(compareString, locales, options);
  }

  match(regexp) {
    assertString(this.__data, 'match');
    return this.__data.match(regexp);
  }

  normalize(form) {
    assertString(this.__data, 'normalize');
    return this.__data.normalize(form);
  }

  padEnd(targetLength, padString) {
    assertString(this.__data, 'padEnd');
    return this.__data.padEnd(targetLength, padString);
  }

  padStart(targetLength, padString) {
    assertString(this.__data, 'padStart');
    return this.__data.padStart(targetLength, padString);
  }

  repeat(count) {
    assertString(this.__data, 'repeat');
    return this.__data.repeat(count);
  }

  replace(pattern, newSubStr) {
    assertString(this.__data, 'repeat');
    return this.__data.replace(pattern, newSubStr);
  }

  search(pattern) {
    assertString(this.__data, 'search');
    return this.__data.search(pattern);
  }

  split(separator, limit) {
    assertString(this.__data, 'split');
    return this.__data.split(separator, limit);
  }

  startsWith(searchString, position) {
    assertString(this.__data, 'startsWith');
    return this.__data.startsWith(searchString, position);
  }

  substring(startIndex, endIndex) {
    assertString(this.__data, 'substring');
    return this.__data.substring(startIndex, endIndex);
  }

  toLocaleLowerCase(locale) {
    assertString(this.__data, 'toLocaleLowerCase');
    return this.__data.toLocaleLowerCase(locale);
  }

  toLocaleUpperCase(locale) {
    assertString(this.__data, 'toLocaleUpperCase');
    return this.__data.toLocaleUpperCase(locale);
  }

  toLowerCase() {
    assertString(this.__data, 'toLowerCase');
    return this.__data.toLowerCase();
  }

  toUpperCase() {
    assertString(this.__data, 'toUpperCase');
    return this.__data.toUpperCase();
  }

  trim() {
    assertString(this.__data, 'trim');
    return this.__data.trim();
  }

  trimEnd() {
    assertString(this.__data, 'trimEnd');
    return this.__data.trimEnd();
  }

  trimRight() {
    assertString(this.__data, 'trimRight');
    return this.__data.trimRight();
  }

  trimStart() {
    assertString(this.__data, 'trimStart');
    return this.__data.trimStart();
  }

  trimLeft() {
    assertString(this.__data, 'trimLeft');
    return this.__data.trimLeft();
  }

  // Polymorphic properties and methods
  get length() {
    return this.__data.length;
  }

  concat(...values) {
    assertArrayOrString(this.__data, 'concat');
    return new Perspective(this.__data.concat(...values));
  }

  includes(value, startPos = 0) {
    assertArrayOrString(this.__data, 'includes');
    if (value instanceof Perspective || typeof this.__data === 'string') {
      return !!this.__data.includes(value, startPos);
    }
    return !!this.__data.slice(startPos).find(elm => elm.toJS() === value);
  }

  indexOf(value, startValue = 0) {
    assertArrayOrString(this.__data, 'indexOf');
    if (value instanceof Perspective || typeof this.__data === 'string') {
      return this.__data.indexOf(value, startValue);
    }
    return this.__data.slice(0).reduce((acc, elm, i, arr) => {
      if (i >= startValue && elm.toJS() === value) {
        arr.splice(1);
        return i;
      }
      return acc;
    }, -1);
  }

  lastIndexOf(value, fromIndex = this.length) {
    assertArrayOrString(this.__data, 'lastIndexOf');
    if (value instanceof Perspective || typeof this.__data === 'string') {
      return this.__data.lastIndexOf(value, fromIndex);
    }
    return this.__data.reduce((acc, elm, i) => {
      if (i <= fromIndex && elm.toJS() === value) {
        return i;
      }
      return acc;
    }, -1);
  }

  slice(startIndex, endIndex) {
    assertArrayOrString(this.__data, 'slice');
    return new Perspective(this.__data.slice(startIndex, endIndex));
  }
}

const createStore = data => new Perspective(data);

module.exports = { Perspective, createStore };
