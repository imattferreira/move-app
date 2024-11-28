import pgp from "pg-promise";
import Account from "../entities/account";

export default interface AccountsRepository {
  save(account: Account): Promise<void>;
  findByAccountId(accountId: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
}

export class PsqlAccountsRepository implements AccountsRepository {
  async save(account: Account): Promise<void> {
    const query = "INSERT INTO ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const params = [
      account.id,
      account.name,
      account.email,
      account.cpf,
      account.carPlate,
      account.isPassenger,
      account.isDriver,
      account.password
    ];
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    await connection.query(query, params);
    await connection.$pool.end();
  }

  async findByAccountId(accountId: string): Promise<Account | null> {
    const query = "SELECT * FROM ccca.account WHERE account_id = $1";
    const params = [accountId];
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    const [account] = await connection.query(query, params);
    await connection.$pool.end();

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
    const query = "SELECT * FROM ccca.account WHERE email = $1";
    const params = [email];
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    const [account] = await connection.query(query, params);
    await connection.$pool.end();

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
}

export class AccountsRepositoryInMemory implements AccountsRepository {
  private stored: Account[];

  constructor() {
    this.stored = [];
  }

  async save(account: Account): Promise<void> {
    this.stored.push(account);
  }

  async findByAccountId(accountId: string): Promise<Account | null> {
    return this.stored.find(account => account.id === accountId) || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.stored.find(account => account.email === email) || null;
  }
}
