import { createMigrationName, getAvailableMigrations } from './common';
import { ENTRYPOINT } from './constants';
import fs from 'node:fs';
import path from 'node:path';
import pgp from 'pg-promise';

const db = pgp()('postgres://postgres:123456@localhost:5432/app');

async function createControlTable() {
  const statement = `
    CREATE TABLE ccca.migrations (
      id    TEXT        NOT NULL,
      name  TEXT        NOT NULL,
      date  TIMESTAMP   DEFAULT NOW()
    );
  `;

  await db.query(statement);
}

async function getAppliedMigrations() {
  const statement = `
  SELECT EXISTS (
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'ccca'
    AND table_name = 'migrations'
  );
  `;

  const [{ exists }] = await db.query(statement);

  if (!exists) {
    await createControlTable();
    return [];
  }

  const migrations = await db.query('SELECT * FROM ccca.migrations');

  return migrations.map(migration =>
    createMigrationName(migration.name, Number(migration.id))
  );
}

async function applyMigration(filename: string) {
  const dir = path.resolve(ENTRYPOINT, filename);
  const sql = fs.readFileSync(dir, 'utf-8');
  const statement = `INSERT INTO ccca.migrations (id, name) VALUES ($1, $2);`;
  const params = filename.split(/__|\./g).slice(0, 2);

  await db.query(sql);
  await db.query(statement, params);
}

async function applyMigrations() {
  const applied = await getAppliedMigrations();
  const migrations = getAvailableMigrations();
  const migrationsToApply = migrations.filter(m => !applied.includes(m));

  for (const migration of migrationsToApply) {
    await applyMigration(migration);
  }

  db.$pool.end();
}

export default applyMigrations;
