export type Optional<T> = {
  [k in keyof T]?: T[k];
};

export type Object = Record<string, unknown>;
