import type AccountsRepository from "../repositories/accounts-repository";

interface Input {
  accountId: string;
}

type Output = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  car_plate: string | null;
  is_passenger: boolean;
  is_driver: boolean;
  password: string;
};

class GetAccount {
  constructor(private readonly accountsRepository: AccountsRepository) { }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountsRepository.findByAccountId(input.accountId);

    if (!account) {
      throw new Error('account not found');
    }

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      car_plate: account.carPlate,
      is_passenger: account.isPassenger,
      is_driver: account.isDriver,
      password: account.password
    };
  }
}

export default GetAccount;
