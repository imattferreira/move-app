import Identifier from '~/domain/value-objects/identifier';

type Statuses = 'processing' | 'completed';

class Transaction {
  private readonly id: Identifier;
  private readonly rideId: Identifier;
  private readonly amount: number;
  private readonly status: Statuses;
  private readonly date: Date;

  constructor(
    id: string,
    rideId: string,
    amount: number,
    status: Statuses,
    date: Date
  ) {
    this.id = new Identifier(id);
    this.rideId = new Identifier(rideId);
    this.amount = amount;
    this.status = status;
    this.date = date;
  }

  static create(rideId: string, amount: number): Transaction {
    const id = Identifier.create().getValue();
    const status = 'processing';
    const now = new Date();

    return new Transaction(
      id,
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
    return this.amount;
  }

  getStatus(): Statuses {
    return this.status;
  }

  getDate(): Date {
    return this.date;
  }
}

export default Transaction;
