// TODO: validate UUID param before query with it in database
// Composition-Root
import '../../../scripts/dotenv';
import AccountsController from './infra/controllers/accounts-controller';
import AccountsRepositoryInMemory from './infra/repositories/in-memory/accounts-repository';
import { ExpressHttpServerAdapter } from './infra/http/http-server';
import GetAccount from './application/use-cases/get-account';
import { PgPromiseAdapter } from './infra/connections/database-connection';
import PsqlAccountsRepository from './infra/repositories/psql/accounts-repository';
import Registry from './infra/registry/registry';
import SignUp from './application/use-cases/signup';

const registry = Registry.getInstance();

registry.provide('SignUp', new SignUp());
registry.provide('GetAccount', new GetAccount());

if (['development', 'production'].includes(process.env.NODE_ENV || '')) {
  const httpServer = new ExpressHttpServerAdapter();

  registry.provide('DatabaseConnection', new PgPromiseAdapter());
  registry.provide('AccountsRepository', new PsqlAccountsRepository());
  registry.provide('HttpServer', httpServer);

  new AccountsController();

  // const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

  // signals.forEach((signal) => {
  //   process.on(signal, async () => {
  //     console.log({ signal });
  //     // await connection.close();
  //     httpServer.close();
  //     process.exit(0);
  //   });
  // });
  httpServer.listen(3000);
}

if (process.env.NODE_ENV === 'testing') {
  registry.provide('AccountsRepository', new AccountsRepositoryInMemory());
}
