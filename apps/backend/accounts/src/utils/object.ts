import type { Object } from './types';

const isObj = (data: unknown): data is Object =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

export function snakefy<T extends Object>(obj: T): Object {
  function iterator<K>(obj: K, tmp: Object) {
    for (const key in obj) {
      const snakedKey = key.replace(
        /[A-Z]/,
        letter => `_${letter.toLowerCase()}`
      );

      if (Array.isArray(obj[key])) {
        const parsedArr = [];

        for (const item of obj[key]) {
          if (!isObj(item)) {
            parsedArr.push(item);
            continue;
          }

          const parsed = {};

          iterator(item, parsed);

          parsedArr.push(parsed);
        }

        tmp[snakedKey] = parsedArr;
        continue;
      }

      if (isObj(obj[key])) {
        tmp[snakedKey] = {};

        iterator(obj[key], tmp[snakedKey] as Object);
        continue;
      }

      tmp[snakedKey] = obj[key];
    }

    return tmp;
  }

  const result = {};

  iterator(obj, result);

  return result;
}

export function camelfy<T extends Object>(obj: T): Object {
  function iterator<K>(obj: K, tmp: Object) {
    for (const key in obj) {
      const cameldKey = key.replace(/_[a-z]/, matched =>
        matched[1].toUpperCase()
      );

      if (Array.isArray(obj[key])) {
        const parsedArr = [];

        for (const item of obj[key]) {
          if (!isObj(item)) {
            parsedArr.push(item);
            continue;
          }

          const parsed = {};

          iterator(item, parsed);

          parsedArr.push(parsed);
        }

        tmp[cameldKey] = parsedArr;
        continue;
      }

      if (isObj(obj[key])) {
        tmp[cameldKey] = {};

        iterator(obj[key], tmp[cameldKey] as Object);
        continue;
      }

      tmp[cameldKey] = obj[key];
    }

    return tmp;
  }

  const result = {};

  iterator(obj, result);

  return result;
}
