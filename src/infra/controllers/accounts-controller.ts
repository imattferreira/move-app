import HttpServer from '~/infra/http/http-server';
import GetAccount from '~/application/use-cases/get-account';
import SignUp from '~/application/use-cases/signup';

// Interface Adapter
class AccountsController {
  constructor(
    httpServer: HttpServer,
    signup: SignUp,
    getAccount: GetAccount
  ) {
    httpServer.register('POST', '/signup', signup);
    httpServer.register('GET', '/accounts/:{accountId}', getAccount);
  }
}

export default AccountsController;
