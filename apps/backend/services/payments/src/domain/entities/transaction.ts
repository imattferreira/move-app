import Amount from '~/domain/value-objects/amount';
import Identifier from '~/domain/value-objects/identifier';

type TransactionStatuses = 'success';

class Transaction {
  private readonly id: Identifier;
  private readonly rideId: Identifier;
  private readonly amount: Amount;
  private readonly status: TransactionStatuses;
  private readonly date: Date;

  constructor(
    id: string,
    rideId: string,
    amount: number,
    status: TransactionStatuses,
    date: Date
  ) {
    this.id = new Identifier(id);
    this.rideId = new Identifier(rideId);
    this.amount = new Amount(amount);
    this.status = status;
    this.date = date;
  }

  static create(
    rideId: string,
    amount: number,
    status: TransactionStatuses
  ): Transaction {
    const id = Identifier.create();
    const now = new Date();

    return new Transaction(
      id.getValue(),
      rideId,
      amount,
      status,
      now
    );
  }

  getId(): string {
    return this.id.getValue();
  }

  getRideId(): string {
    return this.rideId.getValue();
  }

  getAmount(): number {
    return this.amount.getValue();
  };

  getStatus(): TransactionStatuses {
    return this.status;
  }

  getDate(): Date {
    return this.date;
  }
}

export default Transaction;
