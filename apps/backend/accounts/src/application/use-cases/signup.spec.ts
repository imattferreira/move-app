import '~/main';
import type AccountsRepository from '~/application/repositories/accounts-repository';
import ConflictException from '~/application/exceptions/conflict-exception';
import InvalidException from '~/application/exceptions/invalid-exception';
import Registry from '~/infra/registry/registry';
import SignUp from './signup';

describe('SignUp', () => {
  it.only('should be able create a driver user', async () => {
    const registry = Registry.getInstance();
    const accountsRepository = registry.inject<AccountsRepository>(
      'AccountsRepository'
    );
    const signup = new SignUp();

    const input = {
      name: 'John Doe',
      email: 'john0@doe.com',
      cpf: '475.646.550-11',
      isDriver: true,
      carPlate: 'ABC1234',
      password: '123456789'
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
    const signup = new SignUp();

    const input = {
      name: 'John Doe',
      email: 'john2@doe.com',
      cpf: '475.646.550-11',
      isDriver: true,
      carPlate: 'ABC',
      password: '123456789'
    };

    await expect(
      () => signup.execute(input)
    ).rejects.toThrow(new InvalidException('invalid [carPlate] field'));
  });

  it('should not create a user with a already registered email', async () => {
    const signup = new SignUp();

    const input = {
      name: 'John Doe',
      email: 'john6@doe.com',
      cpf: '475.646.550-11',
      isPassenger: true,
      password: '123456789'
    };

    await signup.execute(input);

    await expect(
      () => signup.execute(input)
    ).rejects.toThrow(new ConflictException('[email] already registered'));
  });
});
