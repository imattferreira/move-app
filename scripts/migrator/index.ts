import '../dotenv';
import applyMigrations from './apply-migrations';
import composer from './composer';
import createMigration from './create-migration';

function main() {
  const args = process.argv.slice(2);
  const [command, ...opts] = args;

  switch (command) {
    case '--apply':
      applyMigrations();
      break;
    case '--compose':
      composer();
      break;
    case '--migrate':
      createMigration(opts);
      break;
    default:
      console.error('Invalid option!!');
      break;
  }
}

main();
