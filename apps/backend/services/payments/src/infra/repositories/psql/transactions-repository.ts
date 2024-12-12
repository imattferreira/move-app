import DatabaseConnection from '~/infra/database/database-connection';
import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';
import { sql } from '~/infra/repositories/utils/query';

class PsqlTransactionsRepository implements TransactionsRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(account: Account): Promise<void> {
    const query = sql`
      INSERT INTO ccca.account (
      account_id,
      name,
      email,
      cpf,
      car_plate,
      is_passenger,
      is_driver,
      password
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
  );`;
    const params = [
      account.getId(),
      account.getName(),
      account.getEmail(),
      account.getCpf(),
      account.getCarPlate(),
      account.getIsPassenger(),
      account.getIsDriver(),
      account.getPassword()
    ];

    await this.connection.query(query, params);
  }

  async findById(accountId: string): Promise<Account | null> {
    const query = 'SELECT * FROM ccca.account WHERE account_id = $1';
    const params = [accountId];

    const [account] = await this.connection.query(query, params);

    if (!account) {
      return null;
    }

    return new Account(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      account.is_passenger,
      account.is_driver,
      account.password
    );
  }

  async findByEmail(email: string): Promise<Account | null> {
    const query = sql`SELECT * FROM ccca.account WHERE email = $1`;
    const params = [email];

    const [account] = await this.connection.query(query, params);

    if (!account) {
      return null;
    }

    return new Account(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      account.is_passenger,
      account.is_driver,
      account.password
    );
  }

  async delete(accountId: string): Promise<void> {
    const query = sql`DELETE FROM ccca.account WHERE account_id = $1;`;
    const params = [accountId];

    await this.connection.query(query, params);
  }
}

export default PsqlTransactionsRepository;
