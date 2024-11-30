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

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const accountsRepository = new PsqlAccountsRepository(connection);
const ridesRepository = new PsqlRidesRepository(connection);

const signup = new SignUp(accountsRepository);
const getAccount = new GetAccount(accountsRepository);
const requestRide = new RequestRide(accountsRepository, ridesRepository);
const getRide = new GetRide(ridesRepository);
const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

new AccountsController(httpServer, signup, getAccount);
new RidesController(httpServer, requestRide, getRide, acceptRide);

httpServer.listen(3000);
