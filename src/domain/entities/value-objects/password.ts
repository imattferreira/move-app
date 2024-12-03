class Password {
  private readonly value: string;

  constructor(password: string) {
    this.value = password;
  }

  getValue(): string {
    return this.value;
  }
}

export default Password;
