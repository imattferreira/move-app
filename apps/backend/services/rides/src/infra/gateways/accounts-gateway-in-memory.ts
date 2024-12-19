import AccountsGateway, { GetAccountOutput, SignUpInput, SignUpOutput } from '~/application/gateways/accounts-gateway';
import Identifier from '~/domain/value-objects/identifier';

class AccountsGatewayInMemory implements AccountsGateway {
  private accounts: GetAccountOutput[];

  constructor() {
    this.accounts = [];
  }

  async signup(data: SignUpInput): Promise<SignUpOutput> {
    const id = Identifier.create().getValue();

    this.accounts.push({ ...data, id });

    return {
      accountId: id
    };
  }

  async getById(accountId: string): Promise<GetAccountOutput | null> {
    const account = this.accounts.find(a => a.id === accountId);

    return account || null;
  }
}

export default AccountsGatewayInMemory;
