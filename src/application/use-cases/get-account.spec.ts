import Account from '~/domain/entities/account';
import AccountsRepositoryInMemory from '~/infra/repositories/in-memory/accounts-repository';
import GetAccount from './get-account';
import NotFoundException from '~/application/exceptions/not-found-exception';

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
    const output = await getAccount.execute({ accountId: account.getId() });

    expect(output.name).toBe(account.getName());
    expect(output.email).toBe(account.getEmail());
    expect(output.cpf).toBe(account.getCpf());
    expect(output.isPassenger).toBe(true);
    expect(output.isDriver).toBe(false);
    expect(output.carPlate).toBe(account.getCarPlate());
    expect(output.password).toBe(account.getPassword());
  });

  it('should not get info about a non-existing accunt', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const getAccount = new GetAccount(accountsRepository);

    const accountId = Math.random().toString();

    await expect(
      () => getAccount.execute({ accountId })
    ).rejects.toThrow(new NotFoundException('account not found'));
  });
});
