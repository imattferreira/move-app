import DatabaseConnection from '~/infra/database/database-connection';
import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';
import { sql } from '~/infra/repositories/utils/query';

class PsqlTransactionsRepository implements TransactionsRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(transaction: Transaction): Promise<void> {
    const query = sql`
      INSERT INTO ccca.transaction (
      transaction_id,
      ride_id,
      amount,
      status,
      date
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
  );`;
    const params = [
      transaction.getId(),
      transaction.getRideId(),
      transaction.getAmount(),
      transaction.getStatus(),
      transaction.getDate()
    ];

    await this.connection.query(query, params);
  }
}

export default PsqlTransactionsRepository;
