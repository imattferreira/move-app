import type AccountsRepository from "../repositories/accounts-repository";
import validateCpf from "../utils/validateCpf";
import Account from '../entities/account';

interface Input {
  name: string;
  email: string;
  cpf: string;
  carPlate: string | null;
  isPassenger: boolean;
  isDriver?: boolean;
  password: string;
}

type Output = { accountId: string } | { message: number };

class SignUp {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      return { message: -3 };
    }

    if (!input.email.match(/^(.+)@(.+)$/)) {
      return { message: -2 };
    }

    if (!validateCpf(input.cpf)) {
      return { message: -1 };
    }

    const registeredUser = await this.accountsRepository.findByEmail(input.email);

    if (registeredUser) {
      return { message: -4 };
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
      return { message: -5 };
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
