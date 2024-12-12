// TODO: validate UUID param before query with it in database
// Composition-Root
import '../../../scripts/dotenv';
import AccountsController from './infra/controllers/accounts-controller';
import { ExpressHttpServerAdapter } from './infra/http/http-server';
import GetAccount from './application/use-cases/get-account';
import { PgPromiseAdapter } from './infra/database/database-connection';
import PsqlAccountsRepository from './infra/repositories/psql/accounts-repository';
import SignUp from './application/use-cases/signup';

const httpServer = new ExpressHttpServerAdapter();
const connection = new PgPromiseAdapter();

const accountsRepository = new PsqlAccountsRepository(connection);

const signup = new SignUp(accountsRepository);
const getAccount = new GetAccount(accountsRepository);

new AccountsController(httpServer, signup, getAccount);

// const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

// signals.forEach((signal) => {
//   process.on(signal, async () => {
//     await connection.close();
//     process.exit(0);
//   });
// });

httpServer.listen(3000);
