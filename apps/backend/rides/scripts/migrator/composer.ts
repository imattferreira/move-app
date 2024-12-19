import { ENTRYPOINT } from './constants';
import fs from 'node:fs';
import { getAvailableMigrations } from './common';
import path from 'node:path';

function readFile(migration: string) {
  const dir = path.resolve(ENTRYPOINT, migration);
  const content = fs.readFileSync(dir, 'utf-8');

  return content;
}

function makeFile(sqls: string[]) {
  const sql = sqls.join('\n');
  const dir = path.resolve(ENTRYPOINT, 'composed.sql');

  fs.unlinkSync(dir);
  fs.appendFileSync(dir, sql);
}

function composer() {
  const migrations = getAvailableMigrations();
  const sqls = migrations.map(readFile);

  makeFile(sqls);
}

export default composer;
