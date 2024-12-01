import { ENTRYPOINT } from './constants';
import { createMigrationName } from './common';
import fs from 'node:fs';
import path from 'node:path';

function getExistingMigrations() {
  const migrations = fs.readdirSync(ENTRYPOINT);

  return migrations.filter(file => file.match(/.sql$/));
}

function getLastMigrationId(migrations: string[]) {
  return Number(
    migrations
      .map(migration => migration.split('__')[0])
      .sort((a, b) => Number(b) - Number(a))[0]
  );
}

function createMigration(opts: string[]) {
  const [name] = opts;

  const migrations = getExistingMigrations();
  const lastMigrationId = getLastMigrationId(migrations);
  const filename = createMigrationName(name, lastMigrationId + 1);
  const dir = path.resolve(ENTRYPOINT, filename);

  fs.appendFileSync(dir, '');
}

export default createMigration;
