class Registry {
  private static __instance: Registry;
  private dependencies: { [name: string]: unknown };

  private constructor() {
    this.dependencies = {};
  }

  static getInstance(): Registry {
    if (!Registry.__instance) {
      Registry.__instance = new Registry();
    }

    return Registry.__instance;
  }

  provide<T>(name: string, instance: T): void {
    this.dependencies[name] = instance;
  }

  inject<T>(name: string): T {
    const dep = this.dependencies[name] as T;

    if (!dep) {
      throw new Error(`dependency ${name} was not registered`);
    }

    return dep;
  }

  cleanup() {
    this.dependencies = {};
  }
}

export default Registry;
