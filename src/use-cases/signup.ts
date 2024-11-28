import type AccountsRepository from "../repositories/accounts-repository";
import validateCpf from "../utils/validateCpf";
import Account from '../entities/account';

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

class SignUp {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      throw new Error('invalid [name] field');
    }

    if (!input.email.match(/^(.+)@(.+)$/)) {
      throw new Error('invalid [email] field');
    }

    if (!validateCpf(input.cpf)) {
      throw new Error('invalid [cpf] field');
    }

    const registeredUser = await this.accountsRepository.findByEmail(input.email);

    if (registeredUser) {
      throw new Error('[email] already registered');
    }

    if (!input.isDriver) {
      const account = Account.create(
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        true,
        false,
        input.password
      );

      this.accountsRepository.save(account);

      return { accountId: account.id };
    }

    if (!input.carPlate?.match(/[A-Z]{3}[0-9]{4}/)) {
      throw new Error('invalid [carPlate] field');
    }

    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      false,
      true,
      input.password
    );

    this.accountsRepository.save(account);

    return { accountId: account.id };
  }
}

export default SignUp;
