import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';

class TransactionsRepositoryInMemory implements TransactionsRepository {
  private stored: Transaction[];

  constructor() {
    this.stored = [];
  }

  async save(transaction: Transaction): Promise<void> {
    this.stored.push(transaction);
  }
}

export default TransactionsRepositoryInMemory;
