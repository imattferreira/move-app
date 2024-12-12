import '../../../scripts/dotenv';
import AcceptRide from './application/use-cases/accept-ride';
import { ExpressAdapter } from './infra/http/http-server';
import { FetchHttpClientAdapter } from './infra/http/http-client';
import FinishRide from './application/use-cases/finish-ride';
import GetRide from './application/use-cases/get-ride';
import HttpAccountsGateway from './infra/gateways/http-accounts-gateway';
import HttpPaymentsGateway from './infra/gateways/http-payments-gateway';
import { PgPromiseAdapter } from './infra/database/database-connection';
import PositionsController from './infra/controllers/positions-controller';
import PsqlPositionsRepository from './infra/repositories/psql/positions-repository';
import PsqlRidesRepository from './infra/repositories/psql/rides-repository';
import QueueMediator from './infra/mediators/queue-mediator';
import RequestRide from './application/use-cases/request-ride';
import RidesController from './infra/controllers/rides-controller';
import StartRide from './application/use-cases/start-ride';
import UpdatePosition from './application/use-cases/update-position';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const httpClient = new FetchHttpClientAdapter();

const ridesRepository = new PsqlRidesRepository(connection);
const positionsRepository = new PsqlPositionsRepository(connection);

const accountsGateway = new HttpAccountsGateway(httpClient);
const paymentsGateway = new HttpPaymentsGateway(httpClient);

const queueMediator = new QueueMediator(paymentsGateway);

const requestRide = new RequestRide(accountsGateway, ridesRepository);
const getRide = new GetRide(
  accountsGateway,
  positionsRepository,
  ridesRepository
);
const acceptRide = new AcceptRide(accountsGateway, ridesRepository);
const startRide = new StartRide(ridesRepository);
const updatePosition = new UpdatePosition(positionsRepository, ridesRepository);
const finishRide = new FinishRide(
  positionsRepository,
  ridesRepository,
  queueMediator
);

new RidesController(
  httpServer,
  requestRide,
  getRide,
  acceptRide,
  startRide,
  finishRide
);
new PositionsController(httpServer, updatePosition);

// const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

// signals.forEach((signal) => {
//   process.on(signal, async () => {
//     await connection.close();
//     process.exit(0);
//   });
// });

httpServer.listen(3000);
