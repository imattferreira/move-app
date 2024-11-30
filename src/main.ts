// Composition Root
import { PgPromiseAdapter } from './adapters/database-connection';
import { ExpressAdapter } from './adapters/http-server';
import AccountsController from './controllers/accounts-controller';
import RidesController from './controllers/rides-controller';
import { PsqlAccountsRepository } from './repositories/accounts-repository';
import { PsqlRidesRepository } from './repositories/rides-repository';
import GetAccount from './use-cases/get-account';
import GetRide from './use-cases/get-ride';
import RequestRide from './use-cases/request-ride';
import SignUp from './use-cases/signup';


const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const accountsRepository = new PsqlAccountsRepository(connection);
const ridesRepository = new PsqlRidesRepository(connection);

const signup = new SignUp(accountsRepository);
const getAccount = new GetAccount(accountsRepository);
const requestRide = new RequestRide(accountsRepository, ridesRepository);
const getRide = new GetRide(ridesRepository);

new AccountsController(httpServer, signup, getAccount);
new RidesController(httpServer, requestRide, getRide);

httpServer.listen(3000);
