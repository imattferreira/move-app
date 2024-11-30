// TODO: validate UUID param before query with it in database
// Composition-Root
import { PgPromiseAdapter } from './infra/database/database-connection';
import { ExpressAdapter } from './infra/http/http-server';
import AccountsController from './infra/controllers/accounts-controller';
import RidesController from './infra/controllers/rides-controller';
import PsqlAccountsRepository from './infra/repositories/psql/accounts-repository';
import PsqlRidesRepository from './infra/repositories/psql/rides-repository';
import GetAccount from './application/use-cases/get-account';
import GetRide from './application/use-cases/get-ride';
import RequestRide from './application/use-cases/request-ride';
import SignUp from './application/use-cases/signup';
import AcceptRide from './application/use-cases/accept-ride';
import StartRide from './application/use-cases/start-ride';
import PositionsController from './infra/controllers/positions-controller';
import UpdatePosition from './application/use-cases/update-position';
import PsqlPositionsRepository from './infra/repositories/psql/positions-repository';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const accountsRepository = new PsqlAccountsRepository(connection);
const ridesRepository = new PsqlRidesRepository(connection);
const positionsRepository = new PsqlPositionsRepository(connection);

const signup = new SignUp(accountsRepository);
const getAccount = new GetAccount(accountsRepository);
const requestRide = new RequestRide(accountsRepository, ridesRepository);
const getRide = new GetRide(ridesRepository);
const acceptRide = new AcceptRide(accountsRepository, ridesRepository);
const startRide = new StartRide(ridesRepository);
const updatePosition = new UpdatePosition(positionsRepository, ridesRepository);

new AccountsController(httpServer, signup, getAccount);
new RidesController(httpServer, requestRide, getRide, acceptRide, startRide);
new PositionsController(httpServer, updatePosition);

async function shutdown() {
  try {
    await connection.close();
    process.exit(0);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (err: any) {
    console.log(err);
    process.exit(1);
  }
}

// Listen for termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

httpServer.listen(3000);
