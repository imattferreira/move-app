import crypto from 'node:crypto';

class Identifier {
  private readonly value: string;

  constructor(id: string) {
    this.value = id;
  }

  static create() {
    return new Identifier(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }
}

export default Identifier;
