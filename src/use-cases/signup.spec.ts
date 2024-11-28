import { AccountsRepositoryInMemory } from "../repositories/accounts-repository";
import SignUp from "./signup";

describe('SignUp', () => {
  it("should be able create a driver user", async () => {
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

    const account = await accountsRepository.findByAccountId(output.accountId);

    // TODO: invert
    // TODO: convert input and output from snake_case to camelCase
    expect(account?.name).toBe(input.name);
    expect(account?.email).toBe(input.email);
    expect(account?.cpf).toBe(input.cpf);
    expect(account?.isDriver).toBe(true);
    expect(account?.isPassenger).toBe(false);
    expect(account?.carPlate).toBe(input.carPlate);
    expect(account?.password).toBe(input.password);
  });

  it("should be able create a passenger user", async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john1@doe.com',
      cpf: '475.646.550-11',
      isPassenger: true,
      password: '123456'
    };

    const output = await signup.execute(input);

    expect(output?.accountId).toBeDefined();

    const account = await accountsRepository.findByAccountId(output.accountId);

    expect(account?.name).toBe(input.name);
    expect(account?.email).toBe(input.email);
    expect(account?.cpf).toBe(input.cpf);
    expect(account?.isDriver).toBe(false);
    expect(account?.isPassenger).toBe(true);
    expect(account?.password).toBe(input.password);
  });

  it("should not create a driver user with a invalid car plate", async () => {
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

    await expect(signup.execute(input)).rejects.toThrow('invalid [carPlate] field');
  });

  it("should not create a user with a invalid name", async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John',
      email: 'john3@doe.com',
      cpf: '475.646.550-11',
      isPasenger: true,
      password: '123456'
    };

    await expect(signup.execute(input)).rejects.toThrow('invalid [name] field');
  });

  it("should not create a user with a invalid email", async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john4doe',
      cpf: '475.646.550-11',
      isPasenger: true,
      password: '123456'
    };

    await expect(signup.execute(input)).rejects.toThrow('invalid [email] field');
  });

  it("should not create a user with a invalid CPF", async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const signup = new SignUp(accountsRepository);

    const input = {
      name: 'John Doe',
      email: 'john5@doe',
      cpf: '111111',
      isPasenger: true,
      password: '123456'
    };

    await expect(signup.execute(input)).rejects.toThrow('invalid [cpf] field');
  });

  it("should not create a user with a already registered email", async () => {
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

    await expect(signup.execute(input)).rejects.toThrow('[email] already registered');
  });
});
