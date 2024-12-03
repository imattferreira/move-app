import Account from './account';
import ConflictException from '~/application/exceptions/conflict-exception';

describe('Account', () => {
  it('should be able create a driver account', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: false,
      isDriver: true,
      password: '123456789'
    };

    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver,
      input.password
    );

    expect(account.getId()).toBeDefined();
    expect(account.getName()).toBe(input.name);
    expect(account.getEmail()).toBe(input.email);
    expect(account.getCpf()).toBe(input.cpf);
    expect(account.getCarPlate()).toBe(input.carPlate);
    expect(account.getIsPassenger()).toBe(input.isPassenger);
    expect(account.getIsDriver()).toBe(input.isDriver);
    expect(account.getPassword()).toBe(input.password);
  });

  it('should be able create a passenger account', () => {
    const input = {
      name: 'John Doe',
      email: 'john@doe.com',
      cpf: '475.646.550-11',
      carPlate: null,
      isPassenger: true,
      isDriver: false,
      password: '123456789'
    };

    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver,
      input.password
    );

    expect(account.getId()).toBeDefined();
    expect(account.getName()).toBe(input.name);
    expect(account.getEmail()).toBe(input.email);
    expect(account.getCpf()).toBe(input.cpf);
    expect(account.getCarPlate()).toBe(input.carPlate);
    expect(account.getIsPassenger()).toBe(input.isPassenger);
    expect(account.getIsDriver()).toBe(input.isDriver);
    expect(account.getPassword()).toBe(input.password);
  });

  it('should not simultaneously create a passenger and driver account', () => {
    expect(() => Account.create(
      'John Doe',
      'john0@doe.com',
      '475.646.550-11',
      'ABC1234',
      true,
      true,
      '123456789'
    )).toThrow(new ConflictException('account should be passenger or driver'));
  });

  it('should not attach a car plate for a passenger account', () => {
    expect(() => Account.create(
      'John Doe',
      'john0@doe.com',
      '475.646.550-11',
      'ABC1234',
      true,
      false,
      '123456789'
    )).toThrow(new ConflictException('passenger cannot have a car plate'));
  });
});
