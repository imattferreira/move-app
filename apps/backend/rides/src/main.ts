import '../../../scripts/dotenv';
import AcceptRide from './application/use-cases/accept-ride';
import AccountsGatewayInMemory from './infra/gateways/accounts-gateway-in-memory';
import { ExpressAdapter } from './infra/http/http-server';
import { FetchHttpClientAdapter } from './infra/http/http-client';
import FinishRide from './application/use-cases/finish-ride';
import GetRide from './application/use-cases/get-ride';
import HttpAccountsGateway from './infra/gateways/http-accounts-gateway';
import { PgPromiseAdapter } from './infra/connections/database-connection';
import PositionsController from './infra/controllers/positions-controller';
import PositionsRepositoryInMemory from './infra/repositories/in-memory/positions-repository';
import PsqlPositionsRepository from './infra/repositories/psql/positions-repository';
import PsqlRidesRepository from './infra/repositories/psql/rides-repository';
import PsqlTransactionsRepository from './infra/repositories/psql/transactions-repository';
import QueueInMemory from './infra/queues/queue-in-memory';
import { RabbitMqAdapter } from './infra/connections/queue-connection';
import RabbitMqQueue from './infra/queues/rabbitmq-queue';
import Registry from './infra/registry/registry';
import RequestRide from './application/use-cases/request-ride';
import RidesController from './infra/controllers/rides-controller';
import RidesRepositoryInMemory from './infra/repositories/in-memory/rides-repository';
import StartRide from './application/use-cases/start-ride';
import TransactionsRepositoryInMemory from './infra/repositories/in-memory/transactions-repository';
import UpdatePosition from './application/use-cases/update-position';

const registry = Registry.getInstance();

registry.provide('RequestRide', new RequestRide());
registry.provide('GetRide', new GetRide());
registry.provide('AcceptRide', new AcceptRide());
registry.provide('StartRide', new StartRide());
registry.provide('UpdatePosition', new UpdatePosition());
registry.provide('FinishRide', new FinishRide());

// mediator.register('ride-finished', (data: any) => {
//   new ProcessPayment().execute(data);
// });

if (['development', 'production'].includes(process.env.NODE_ENV || '')) {
  const httpServer = new ExpressAdapter();

  registry.provide('HttpServer', httpServer);
  registry.provide('QueueConnection', new RabbitMqAdapter());
  registry.provide('Queue', new RabbitMqQueue());
  registry.provide('HttpClient', new FetchHttpClientAdapter());
  registry.provide('AccountsGateway', new HttpAccountsGateway());
  registry.provide('DatabaseConnection', new PgPromiseAdapter());
  registry.provide('RidesRepository', new PsqlRidesRepository());
  registry.provide('PositionsRepository', new PsqlPositionsRepository());
  registry.provide('TransactionsRepository', new PsqlTransactionsRepository());

  new RidesController();
  new PositionsController();

  // const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

  // signals.forEach((signal) => {
  //   process.on(signal, async () => {
  //     await connection.close();
  //     process.exit(0);
  //   });
  // });

  httpServer.listen(3000);
}

if (process.env.NODE_ENV === 'testing') {
  registry.provide('AccountsGateway', new AccountsGatewayInMemory());
  registry.provide('Queue', new QueueInMemory());
  registry.provide('RidesRepository', new RidesRepositoryInMemory());
  registry.provide('PositionsRepository', new PositionsRepositoryInMemory());
  registry.provide(
    'TransactionsRepository',
    new TransactionsRepositoryInMemory()
  );
}
