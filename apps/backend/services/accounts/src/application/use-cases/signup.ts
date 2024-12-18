import Account from '~/domain/entities/account';
import type AccountsRepository from '~/application/repositories/accounts-repository';
import ConflictException from '~/application/exceptions/conflict-exception';
import { inject } from '~/infra/registry';

type Input = {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string | null;
  isPassenger?: boolean;
  isDriver?: boolean;
  password: string;
};

type Output = { accountId: string };

// Use-Case
class SignUp {
  @inject('AccountsRepository')
  private readonly accountsRepository!: AccountsRepository;

  async execute(input: Input): Promise<Output> {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      !!input.isPassenger,
      !!input.isDriver,
      input.password
    );

    const registeredUser = await this.accountsRepository.findByEmail(
      input.email
    );

    if (registeredUser) {
      throw new ConflictException('[email] already registered');
    }

    await this.accountsRepository.save(account);

    return { accountId: account.getId() };
  }
}

export default SignUp;
