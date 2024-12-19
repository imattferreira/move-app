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

  async findById(transactionId: string): Promise<Transaction | null> {
    const transaction = this.stored.find(t => t.getId() === transactionId);

    return transaction || null;
  }
}

export default TransactionsRepositoryInMemory;
