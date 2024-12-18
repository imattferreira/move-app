import AccountsGateway, { GetAccountOuput, SignUpInput, SignUpOutput } from '~/application/gateways/accounts-gateway';

class AccountsGatewayInMemory implements AccountsGateway {
  signup(data: SignUpInput): Promise<SignUpOutput> {
    throw new Error('Method not implemented.');
  }

  getById(accountId: string): Promise<GetAccountOuput> {
    throw new Error('Method not implemented.');
  }
}

export default AccountsGatewayInMemory;
