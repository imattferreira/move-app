import Account from "../entities/account";
import { AccountsRepositoryInMemory } from "../repositories/accounts-repository";
import GetAccount from "./get-account";

describe('GetAccount', () => {
  it('should be able to get info about a existing ride', async () => {
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
    expect(output.is_driver).toBe(true);
    expect(output.is_passenger).toBe(false);
    expect(output.car_plate).toBe(account.carPlate);
    expect(output.password).toBe(account.password);
  });

  it('should not be able to get info about a non-existing ride', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const getAccount = new GetAccount(accountsRepository);

    const accountId = Math.random().toString();

    expect(getAccount.execute({ accountId })).rejects.toThrow("account not found");
  });
});
