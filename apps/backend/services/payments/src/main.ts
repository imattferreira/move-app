import '../../../scripts/dotenv';
import { ExpressAdapter } from './infra/http/http-server';
import { FetchHttpClientAdapter } from './infra/http/http-client';
import HttpRidesGateway from './infra/gateways/http-rides-gateway';
import PaymentsController from './infra/controllers/payments-controller';
import { PgPromiseAdapter } from './infra/database/database-connection';
import ProcessPayment from './application/use-cases/process-payment';
import PsqlTransactionsRepository from './infra/repositories/psql/transactions-repository';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const httpClient = new FetchHttpClientAdapter();

const transactionsRepository = new PsqlTransactionsRepository(connection);

const ridesGateway = new HttpRidesGateway(httpClient);

const processPayment = new ProcessPayment(transactionsRepository, ridesGateway);

new PaymentsController(httpServer, processPayment);

// const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

// signals.forEach((signal) => {
//   process.on(signal, async () => {
//     await connection.close();
//     process.exit(0);
//   });
// });

httpServer.listen(3000);
