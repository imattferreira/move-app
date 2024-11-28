const isObj = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

export function snakefy<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  function iterator<K>(obj: K, tmp: Record<string, unknown>) {
    for (const key in obj) {
      const snakedKey = key.replace(
        /[A-Z]/,
        (letter) => `_${letter.toLowerCase()}`
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

        iterator(obj[key], tmp[snakedKey] as Record<string, unknown>);
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

export function camelfy<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  function iterator<K>(obj: K, tmp: Record<string, unknown>) {
    for (const key in obj) {
      const cameldKey = key.replace(
        /_[a-z]/,
        (matched) => matched[1].toUpperCase()
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

        iterator(obj[key], tmp[cameldKey] as Record<string, unknown>);
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
