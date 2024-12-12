import HttpServer from '~/infra/http/http-server';
import ProcessPayment from '~/application/use-cases/process-payment';

// Interface Adapter
class AccountsController {
  constructor(
    httpServer: HttpServer,
    processPayment: ProcessPayment
  ) {
    httpServer.register('POST', '/v1/signup', signup);
    httpServer.register('GET', '/v1/accounts/:{accountId}', getAccount);
  }
}

export default AccountsController;
