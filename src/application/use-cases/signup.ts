import type AccountsRepository from '../repositories/accounts-repository';
import Account from '../../domain/entities/account';

interface Input {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string | null;
  isPassenger?: boolean;
  isDriver?: boolean;
  password: string;
}

type Output = { accountId: string };

// Use-Case
class SignUp {
  constructor(private readonly accountsRepository: AccountsRepository) {}

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
      throw new Error('[email] already registered');
    }

    await this.accountsRepository.save(account);

    return { accountId: account.id };
  }
}

export default SignUp;
