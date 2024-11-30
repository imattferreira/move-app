import pgp from 'pg-promise';
import type { IClient } from 'pg-promise/typescript/pg-subset';

export default interface DatabaseConnection {
  query(statement: string, params: unknown[]): Promise<any>;
  close(): Promise<void>;
}

// Adapter Pattern (GoF)
export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<{}, IClient>;

  constructor() {
    this.connection = pgp()('postgres://postgres:123456@localhost:5432/app');
  }

  async query(statement: string, params: unknown[]): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
