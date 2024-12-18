import Account from '~/domain/entities/account';
import AccountsRepository from '~/application/repositories/accounts-repository';

class AccountsRepositoryInMemory implements AccountsRepository {
  private stored: Account[];

  constructor() {
    this.stored = [];
  }

  async save(account: Account): Promise<void> {
    this.stored.push(account);
  }

  async findById(accountId: string): Promise<Account | null> {
    const account = this.stored.find(account => account.getId() === accountId);

    return account || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.stored.find(account => account.getEmail() === email);

    return account || null;
  }
}

export default AccountsRepositoryInMemory;
