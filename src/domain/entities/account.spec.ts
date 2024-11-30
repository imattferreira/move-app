import Account from './account';

describe('Account', () => {
  it('should be able create a driver user', async () => {
    const account = Account.create(
      'John Doe',
      'john0@doe.com',
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '123456'
    );

    expect(account.id).toBeDefined();
    expect(account.isDriver).toBe(true);
    expect(account.isPassenger).toBe(false);
  });

  it('should be able create a passenger user', async () => {
    const account = Account.create(
      'John Doe',
      'john0@doe.com',
      '475.646.550-11',
      null,
      true,
      false,
      '123456'
    );

    expect(account.id).toBeDefined();
    expect(account.isPassenger).toBe(true);
    expect(account.isDriver).toBe(false);
  });

  it('should not create a driver user with a invalid car plate', async () => {
    expect(() => Account.create(
      'John Doe',
      'john0@doe.com',
      '475.646.550-11',
      'ABC',
      false,
      true,
      '123456'
    )).toThrow('invalid [carPlate] field');
  });

  it('should not create a driver user with a invalid name', async () => {
    expect(() => Account.create(
      'JJ',
      'john0@doe.com',
      '475.646.550-11',
      'ABC1234',
      true,
      false,
      '123456'
    )).toThrow('invalid [name] field');
  });

  it('should not create a driver user with a invalid email', async () => {
    expect(() => Account.create(
      'John Doe',
      'john',
      '475.646.550-11',
      'ABC1234',
      true,
      false,
      '123456'
    )).toThrow('invalid [email] field');
  });

  it('should not create a driver user with a invalid CPF', async () => {
    expect(() => Account.create(
      'John Doe',
      'john0@doe.com',
      '1111111',
      'ABC1234',
      true,
      false,
      '123456'
    )).toThrow('invalid [cpf] field');
  });
});
