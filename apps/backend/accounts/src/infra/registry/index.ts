import Registry from './registry';

export function inject(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propKey: string) {
    target[propKey] = new Proxy({}, {
      get<K>(_: K, propKey: keyof K) {
        const dep = Registry.getInstance().inject<K>(name);

        return dep[propKey];
      }
    });
  };
}
