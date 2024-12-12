// TODO: validate UUID param before query with it in database
// Composition-Root
import '../../../scripts/dotenv';
import { ExpressAdapter } from './infra/http/http-server';
import { PgPromiseAdapter } from './infra/database/database-connection';
import ProcessPayment from './application/use-cases/process-payment';
import PsqlTransactionsRepository from './infra/repositories/psql/transactions-repository';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const transactionsRepository = new PsqlTransactionsRepository(connection);

const processPayment = new ProcessPayment(transactionsRepository);

// new AccountsController(httpServer, signup, getAccount);

// const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

// signals.forEach((signal) => {
//   process.on(signal, async () => {
//     await connection.close();
//     process.exit(0);
//   });
// });

httpServer.listen(3000);
