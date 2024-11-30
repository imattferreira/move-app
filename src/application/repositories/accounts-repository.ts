import Account from '~/domain/entities/account';

interface AccountsRepository {
  save(account: Account): Promise<void>;
  findById(accountId: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
};

export default AccountsRepository;
