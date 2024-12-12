import Transaction from '~/domain/entities/transaction';

interface TransactionsRepository {
  save(transaction: Transaction): Promise<void>;
};

export default TransactionsRepository;
