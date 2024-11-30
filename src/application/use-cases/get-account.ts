import type AccountsRepository from '../repositories/accounts-repository';

interface Input {
  accountId: string;
}

type Output = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string | null;
  isPassenger: boolean;
  isDriver: boolean;
  password: string;
};

class GetAccount {
  /**
  * DIP - Dependency Inversion Principle
  *
  * If this contract was designed exclusived only for this use-case specifities,
  * this could also be ISP - Interface Segregation Principle
  */
  constructor(private readonly accountsRepository: AccountsRepository) { }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountsRepository.findById(
      input.accountId
    );

    if (!account) {
      throw new Error('account not found');
    }

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.carPlate,
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      password: account.password
    };
  }
}

export default GetAccount;
