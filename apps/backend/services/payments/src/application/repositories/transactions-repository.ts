import Transaction from '~/domain/entities/transaction';

interface TransactionsRepository {
  save(transaction: Transaction): Promise<void>;
  findById(transactionId: string): Promise<Transaction | null>;
}

export default TransactionsRepository;
