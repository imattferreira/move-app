import fs from 'node:fs';
import path from 'node:path';

function main() {
  const dir = path.resolve(__dirname, '..', '.env');
  const env = fs.readFileSync(dir, 'utf-8');
  const vars = env.split('\n').reduce((p, c) => {
    const [key, value] = c.split('=');

    return { ...p, [key]: value };
  }, {});

  process.env = {
    ...process.env,
    ...vars
  };
}

main();
