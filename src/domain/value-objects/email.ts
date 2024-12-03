import InvalidException from '~/application/exceptions/invalid-exception';

class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email.match(/^(.+)@(.+)$/)) {
      throw new InvalidException('invalid [email] field');
    }

    this.value = email;
  }

  getValue(): string {
    return this.value;
  }
}

export default Email;
