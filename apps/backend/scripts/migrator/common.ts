import { ENTRYPOINT } from './constants';
import fs from 'node:fs';

export function createMigrationName(
  name: string,
  migrationId: number
) {
  const paddedId = migrationId.toString().padStart(3, '0');
  const postfix = name.replace(/\s/g, '-');

  return `${paddedId}__${postfix}.sql`;
}

export function getAvailableMigrations() {
  const migrations = fs.readdirSync(ENTRYPOINT);

  return migrations.filter(file => file.match(/.sql$/));
}
