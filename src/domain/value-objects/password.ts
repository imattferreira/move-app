import InvalidException from '~/application/exceptions/invalid-exception';

class Password {
  private readonly value: string;

  constructor(password: string) {
    if (password.length < 8 || password.length > 32) {
      throw new InvalidException('invalid [password] field');
    }

    this.value = password;
  }

  getValue(): string {
    return this.value;
  }
}

export default Password;
