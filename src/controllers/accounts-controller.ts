import HttpServer from "../adapters/http-server";
import GetAccount from "../use-cases/get-account";
import SignUp from "../use-cases/signup";

// Interface Adapter
class AccountsController {
  constructor(
    httpServer: HttpServer,
    signup: SignUp,
    getAccount: GetAccount
  ) {
    httpServer.register('POST', '/signup', signup.execute);
    httpServer.register('GET', '/accounts/:{accountId}', getAccount.execute);
  }
}

export default AccountsController;
