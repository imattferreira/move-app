import type AccountsRepository from '~/application/repositories/accounts-repository';
import NotFoundException from '~/application/exceptions/not-found-exception';

type Input = {
  accountId: string;
};

// Data-Transfer Object (DTO)
type Output = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string | null;
  isPassenger: boolean;
  isDriver: boolean;
};

class GetAccount {
  /**
   * DIP - Dependency Inversion Principle
   *
   * If this contract was designed exclusively only for this use-case
   * specificities, this could also be ISP - Interface Segregation Principle
   */
  constructor(private readonly accountsRepository: AccountsRepository) { }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountsRepository.findById(input.accountId);

    if (!account) {
      throw new NotFoundException('account not found');
    }

    return {
      id: account.getId(),
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      carPlate: account.getCarPlate(),
      isPassenger: account.getIsPassenger(),
      isDriver: account.getIsDriver()
    };
  }
}

export default GetAccount;
