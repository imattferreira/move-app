import Amount from './amount';
import InvalidException from '~/application/exceptions/invalid-exception';

describe('Amount', async () => {
  it('should be able to create an amount', () => {
    const input = Math.random() * 100;

    const amount = new Amount(input);

    expect(amount.getValue()).toBe(input);
  });

  it('should not be able to create an amount with invalid value', () => {
    expect(
      () => new Amount(Math.random() * -100)
    ).toThrow(new InvalidException('invalid [amount] field'));
  });
});
