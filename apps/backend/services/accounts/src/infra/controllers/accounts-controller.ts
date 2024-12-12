import GetAccount from '~/application/use-cases/get-account';
import HttpServer from '~/infra/http/http-server';
import SignUp from '~/application/use-cases/signup';

// Interface Adapter
class AccountsController {
  constructor(
    httpServer: HttpServer,
    signup: SignUp,
    getAccount: GetAccount
  ) {
    httpServer.register('POST', '/v1/signup', signup);
    httpServer.register('GET', '/v1/accounts/:{accountId}', getAccount);
  }
}

export default AccountsController;
