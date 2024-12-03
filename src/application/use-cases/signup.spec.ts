import AccountsRepositoryInMemory from '~/infra/repositories/in-memory/accounts-repository';
import ConflictException from '~/application/exceptions/conflict-exception';
import InvalidException from '~/application/exceptions/invalid-exception';
import SignUp from './signup';

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

    expect(account?.getName()).toBe(input.name);
    expect(account?.getEmail()).toBe(input.email);
    expect(account?.getCpf()).toBe(input.cpf);
    expect(account?.getIsDriver()).toBe(true);
    expect(account?.getIsPassenger()).toBe(false);
    expect(account?.getCarPlate()).toBe(input.carPlate);
    expect(account?.getPassword()).toBe(input.password);
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
