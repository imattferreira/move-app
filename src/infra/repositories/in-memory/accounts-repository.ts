import AccountsRepository from "~/application/repositories/accounts-repository";
import Account from "~/domain/entities/account";

class AccountsRepositoryInMemory implements AccountsRepository {
  private stored: Account[];

  constructor() {
    this.stored = [];
  }

  async save(account: Account): Promise<void> {
    this.stored.push(account);
  }

  async findById(accountId: string): Promise<Account | null> {
    const account = this.stored.find((account) => account.id === accountId);

    return account || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.stored.find((account) => account.email === email);

    return account || null;
  }
}

export default AccountsRepositoryInMemory;
