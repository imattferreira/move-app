import Registry from './registry';

export function inject(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propKey: string) {
    target[propKey] = new Proxy({}, {
      get<K>(_: K, propKey: keyof K) {
        const dep = Registry.getInstance().inject<K>(name);

        if (!dep) {
          throw new Error(`dependency ${name} was not registered`);
        }

        return dep[propKey];
      }
    });
  };
}

// TODO:
// export function registry(name: string) {
//   return (target: unknown) => {
//     Registry.getInstance().provide(name, target);
//   };
// }
