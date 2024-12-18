import '~/../../../scripts/dotenv';
import Account from '~/domain/entities/account';
import { PgPromiseAdapter } from '~/infra/database/database-connection';
import PsqlAccountsRepository from './accounts-repository';
import crypto from 'node:crypto';

const connection = new PgPromiseAdapter();
const accountsRepository = new PsqlAccountsRepository(connection);

afterAll(() => {
  connection.close();
});

describe.skip('PsqlAccountsRepository', () => {
  it('should be able to save a account', async () => {
    const account = Account.create(
      'John Doe',
      `john${Math.random()}@doe.com`,
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '1233456789'
    );

    await accountsRepository.save(account);

    const savedAccount = await accountsRepository.findById(account.getId());

    expect(savedAccount).toBeInstanceOf(Account);
    expect(savedAccount?.getId()).toBe(account.getId());
    expect(savedAccount?.getCpf()).toBe(account.getCpf());
    expect(savedAccount?.getName()).toBe(account.getName());
    expect(savedAccount?.getEmail()).toBe(account.getEmail());
    expect(savedAccount?.getCarPlate()).toBe(account.getCarPlate());
    expect(savedAccount?.getPassword()).toBe(account.getPassword());
    expect(savedAccount?.getIsDriver()).toBe(account.getIsDriver());
    expect(savedAccount?.getIsPassenger()).toBe(account.getIsPassenger());
  });

  it(
    'should not be able to get a non-existing account by your id',
    async () => {
      const id = crypto.randomUUID();
      const account = await accountsRepository.findById(id);

      expect(account).toBeNull();
    });

  it('should be able to get a existing account by your email', async () => {
    const account = Account.create(
      'John Doe',
      `john${Math.random()}@doe.com`,
      '665.762.000-48',
      null,
      true,
      false,
      '1233456789'
    );

    await accountsRepository.save(account);

    const savedAccount = await accountsRepository.findByEmail(
      account.getEmail()
    );

    expect(savedAccount).toBeInstanceOf(Account);
    expect(savedAccount?.getId()).toBe(account.getId());
    expect(savedAccount?.getCpf()).toBe(account.getCpf());
    expect(savedAccount?.getName()).toBe(account.getName());
    expect(savedAccount?.getEmail()).toBe(account.getEmail());
    expect(savedAccount?.getCarPlate()).toBe(account.getCarPlate());
    expect(savedAccount?.getPassword()).toBe(account.getPassword());
    expect(savedAccount?.getIsDriver()).toBe(account.getIsDriver());
    expect(savedAccount?.getIsPassenger()).toBe(account.getIsPassenger());

    accountsRepository.delete(account.getId());
  });

  it(
    'should not be able to get a non-existing account by your email',
    async () => {
      const email = `john${Math.random()}@doe.com`;
      const account = await accountsRepository.findByEmail(email);

      expect(account).toBeNull();
    });
});
