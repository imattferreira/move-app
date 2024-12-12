import type { IClient } from 'pg-promise/typescript/pg-subset';
import config from '../config';
import pgp from 'pg-promise';

export default interface DatabaseConnection {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(statement: string, params: unknown[]): Promise<any>;
  close(): Promise<void>;
}

// Adapter Pattern (GoF)
export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<object, IClient>;

  constructor() {
    this.connection = pgp()(config.DATABASE_URI);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(statement: string, params: unknown[]): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
