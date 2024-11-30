import AccountsRepositoryInMemory from '~/infra/repositories/in-memory/accounts-repository';
import SignUp from './signup';
import InvalidException from '~/application/exceptions/invalid-exception';
import ConflictException from '~/application/exceptions/conflict-exception';

describe('SignUp', () => {
  it('should be able create a driver user', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john0@doe.com',
      cpf: '475.646.550-11',
      isDriver: true,
      carPlate: 'ABC1234',
      password: '123456'
    };

    const output = await signup.execute(input);

    expect(output?.accountId).toBeDefined();

    const account = await accountsRepository.findById(output.accountId);

    expect(account?.name).toBe(input.name);
    expect(account?.email).toBe(input.email);
    expect(account?.cpf).toBe(input.cpf);
    expect(account?.isDriver).toBe(true);
    expect(account?.isPassenger).toBe(false);
    expect(account?.carPlate).toBe(input.carPlate);
    expect(account?.password).toBe(input.password);
  });

  it('should not create a driver user with a invalid car plate', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john2@doe.com',
      cpf: '475.646.550-11',
      isDriver: true,
      carPlate: 'ABC',
      password: '123456'
    };

    await expect(
      () => signup.execute(input)
    ).rejects.toThrow(new InvalidException('invalid [carPlate] field'));
  });

  it('should not create a user with a already registered email', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john6@doe.com',
      cpf: '475.646.550-11',
      isPassenger: true,
      password: '123456'
    };

    await signup.execute(input);

    await expect(
      () => signup.execute(input)
    ).rejects.toThrow(new ConflictException('[email] already registered'));
  });
});
