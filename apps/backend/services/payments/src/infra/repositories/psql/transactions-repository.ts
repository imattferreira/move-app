import DatabaseConnection from '~/infra/connections/database-connection';
import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';
import { inject } from '~/infra/registry';
import { sql } from '~/infra/repositories/utils/query';

class PsqlTransactionsRepository implements TransactionsRepository {
  @inject('DatabaseConnection')
  private readonly connection!: DatabaseConnection;

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
        $5
        );
    `;
    const params = [
      transaction.getId(),
      transaction.getRideId(),
      transaction.getAmount(),
      transaction.getStatus(),
      transaction.getDate()
    ];

    await this.connection.query(query, params);
  }

  async findById(transactionId: string): Promise<Transaction | null> {
    const query = sql`SELECT * FROM ccca.transaction WHERE transaction_id = $1`;
    const params = [transactionId];

    const [ride] = await this.connection.query(query, params);

    if (!ride) {
      return null;
    }

    return new Transaction(
      ride.transaction_id,
      ride.ride_id,
      parseFloat(ride.amount),
      ride.status,
      new Date(ride.date)
    );
  }
}

export default PsqlTransactionsRepository;
