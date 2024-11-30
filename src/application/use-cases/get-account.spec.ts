import Account from '~/domain/entities/account';
import AccountsRepositoryInMemory from '~/infra/repositories/in-memory/accounts-repository';
import GetAccount from './get-account';

describe('GetAccount', () => {
  it('should be able to get info about a existing account', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const getAccount = new GetAccount(accountsRepository);

    const account = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      null,
      true,
      false,
      '1233456'
    );

    await accountsRepository.save(account);
    const output = await getAccount.execute({ accountId: account.id });

    expect(output.name).toBe(account.name);
    expect(output.email).toBe(account.email);
    expect(output.cpf).toBe(account.cpf);
    expect(output.isPassenger).toBe(true);
    expect(output.isDriver).toBe(false);
    expect(output.carPlate).toBe(account.carPlate);
    expect(output.password).toBe(account.password);
  });

  it('should not get info about a non-existing accunt', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const getAccount = new GetAccount(accountsRepository);

    const accountId = Math.random().toString();

    await expect(getAccount.execute({ accountId })).rejects.toThrow('account not found');
  });
});
