import Transaction from './transaction';

describe('Transaction', () => {
  it('should be able create a transaction', async () => {
    const input = {
      rideId: Math.random().toString(),
      amount: Math.random() * 100
    };

    const transaction = Transaction.create(
      input.rideId,
      input.amount,
      'success'
    );

    expect(transaction.getId()).toBeDefined();
    expect(transaction.getRideId()).toBe(input.rideId);
    expect(transaction.getAmount()).toBe(input.amount);
    expect(transaction.getStatus()).toBe('success');
    expect(transaction.getDate()).toBeInstanceOf(Date);
  });
});
