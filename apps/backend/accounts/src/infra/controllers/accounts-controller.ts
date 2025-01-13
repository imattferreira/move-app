import GetAccount from '~/application/query/get-account';
import HttpServer from '~/infra/http/http-server';
import SignUp from '~/application/use-cases/signup';
import { inject } from '~/infra/registry';

// Interface Adapter
class AccountsController {
  @inject('HttpServer')
  private readonly httpServer!: HttpServer;

  @inject('SignUp')
  private readonly signup!: SignUp;

  @inject('GetAccount')
  private readonly getAccount!: GetAccount;

  constructor() {
    this.httpServer.register('POST', '/v1/signup', this.signup);
    this.httpServer.register(
      'GET',
      '/v1/accounts/:{accountId}',
      this.getAccount
    );
  }
}

export default AccountsController;
