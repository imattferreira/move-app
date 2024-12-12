import
AccountsGateway, {
  GetAccountOuput,
  SignUpInput,
  SignUpOutput
} from '~/application/gateways/accounts-gateway';
import HttpClient from '~/infra/http/http-client';

class HttpAccountsGateway implements AccountsGateway {
  constructor(private readonly client: HttpClient) {}

  signup(data: SignUpInput): Promise<SignUpOutput> {
    return this.client.post(
      'http://localhost:3000/v1/signup',
      data
    );
  }

  getById(accountId: string): Promise<GetAccountOuput> {
    return this.client.get(
      `http://localhost:3000/v1/accounts/${accountId}`
    );
  }
}

export default HttpAccountsGateway;
