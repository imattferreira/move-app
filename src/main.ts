// TODO: validate UUID param before query with it in database
// Composition-Root
import '../scripts/dotenv';
import AcceptRide from './application/use-cases/accept-ride';
import AccountsController from './infra/controllers/accounts-controller';
import { ExpressAdapter } from './infra/http/http-server';
import FinishRide from './application/use-cases/finish-ride';
import GetAccount from './application/use-cases/get-account';
import GetRide from './application/use-cases/get-ride';
import { PgPromiseAdapter } from './infra/database/database-connection';
import PositionsController from './infra/controllers/positions-controller';
import PsqlAccountsRepository from './infra/repositories/psql/accounts-repository';
import PsqlPositionsRepository from './infra/repositories/psql/positions-repository';
import PsqlRidesRepository from './infra/repositories/psql/rides-repository';
import RequestRide from './application/use-cases/request-ride';
import RidesController from './infra/controllers/rides-controller';
import SignUp from './application/use-cases/signup';
import StartRide from './application/use-cases/start-ride';
import UpdatePosition from './application/use-cases/update-position';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const accountsRepository = new PsqlAccountsRepository(connection);
const ridesRepository = new PsqlRidesRepository(connection);
const positionsRepository = new PsqlPositionsRepository(connection);

const signup = new SignUp(accountsRepository);
const getAccount = new GetAccount(accountsRepository);
const requestRide = new RequestRide(accountsRepository, ridesRepository);
const getRide = new GetRide(
  accountsRepository,
  positionsRepository,
  ridesRepository
);
const acceptRide = new AcceptRide(accountsRepository, ridesRepository);
const startRide = new StartRide(ridesRepository);
const updatePosition = new UpdatePosition(positionsRepository, ridesRepository);
const finishRide = new FinishRide(positionsRepository, ridesRepository);

new AccountsController(httpServer, signup, getAccount);
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
