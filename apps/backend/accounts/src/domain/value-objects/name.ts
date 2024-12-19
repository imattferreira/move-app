import InvalidException from '~/application/exceptions/invalid-exception';

// Value-Object
class Name {
  private readonly value: string;

  constructor(name: string) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      throw new InvalidException('invalid [name] field');
    }

    this.value = name;
  }

  getValue(): string {
    return this.value;
  }
}

export default Name;
