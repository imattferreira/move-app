import InvalidException from '~/application/exceptions/invalid-exception';

class Amount {
  private readonly value: number;

  constructor(amount: number) {
    if (amount <= 0) {
      throw new InvalidException('invalid [amount] field');
    }

    this.value = amount;
  }

  getValue(): number {
    return this.value;
  }
}

export default Amount;
