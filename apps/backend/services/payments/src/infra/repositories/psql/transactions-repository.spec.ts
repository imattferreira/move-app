import '~/../../../scripts/dotenv';
import { PgPromiseAdapter } from '~/infra/database/database-connection';
// import PsqlTransactionsRepository from './transactions-repository';
// import Transaction from '~/domain/entities/transaction';

const connection = new PgPromiseAdapter();
// const transactionsRepository = new PsqlTransactionsRepository(connection);

afterAll(() => {
  connection.close();
});

describe.skip('PsqlTransactionsRepository', () => {
  it('should be able to save a transaction', async () => {
    // const transaction = Transaction.create(
    // Math.random().toString(),
    // Math.random() * 100,
    // 'success'
    // );
    // const savedAccount = await accountsRepository.findById(account.getId());

    // expect(savedAccount).toBeInstanceOf(Account);
    // expect(savedAccount?.getId()).toBe(account.getId());
    // expect(savedAccount?.getCpf()).toBe(account.getCpf());
    // expect(savedAccount?.getName()).toBe(account.getName());
    // expect(savedAccount?.getEmail()).toBe(account.getEmail());
    // expect(savedAccount?.getCarPlate()).toBe(account.getCarPlate());
    // expect(savedAccount?.getPassword()).toBe(account.getPassword());
    // expect(savedAccount?.getIsDriver()).toBe(account.getIsDriver());
    // expect(savedAccount?.getIsPassenger()).toBe(account.getIsPassenger());
  });
});
