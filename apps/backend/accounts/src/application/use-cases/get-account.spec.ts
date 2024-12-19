import '~/main';
import Account from '~/domain/entities/account';
import AccountsRepository from '~/application/repositories/accounts-repository';
import GetAccount from './get-account';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';

describe('GetAccount', () => {
  it('should be able to get info about a existing account', async () => {
    const registry = Registry.getInstance();
    const accountsRepository = registry.inject<AccountsRepository>(
      'AccountsRepository'
    );
    const getAccount = new GetAccount();

    const account = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      null,
      true,
      false,
      '1233456789'
    );

    await accountsRepository.save(account);
    const output = await getAccount.execute({ accountId: account.getId() });

    expect(output.name).toBe(account.getName());
    expect(output.email).toBe(account.getEmail());
    expect(output.cpf).toBe(account.getCpf());
    expect(output.isPassenger).toBe(true);
    expect(output.isDriver).toBe(false);
    expect(output.carPlate).toBe(account.getCarPlate());
  });

  it('should not get info about a non-existing accunt', async () => {
    const getAccount = new GetAccount();
    const accountId = Identifier.create().getValue();

    await expect(
      () => getAccount.execute({ accountId })
    ).rejects.toThrow(new NotFoundException('account not found'));
  });
});
