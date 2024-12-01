import path from 'node:path';

export const DATABASE_URI = 'postgres://postgres:123456@localhost:5432/app';

export const ENTRYPOINT = path.resolve(__dirname, '..', '..', 'migrations');
