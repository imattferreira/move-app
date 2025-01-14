import DatabaseConnection from '~/infra/connections/database-connection';
import NotFoundException from '~/application/exceptions/not-found-exception';
import { inject } from '~/infra/registry';
import { sql } from '~/infra/repositories/utils/query';

type Input = {
  accountId: string;
};

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
   * DI - Dependency Injection
   * DIP - Dependency Inversion Principle
   *
   * If this contract was designed exclusively only for this use-case
   * specificities, this could also be ISP - Interface Segregation Principle
   */
  @inject('DatabaseConnection')
  private readonly connection!: DatabaseConnection;

  async execute(input: Input): Promise<Output> {
    const query = sql`
      SELECT
        account_id,
        name,
        email,
        cpf,
        car_plate,
        is_passenger,
        is_driver
      FROM ccca.accounts
      WHERE account_id = $1
    `;
    const [account] = await this.connection.query(query, [input.accountId]);

    if (!account) {
      throw new NotFoundException('account not found');
    }

    // DTO - Data Transfer Object
    return {
      id: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.car_plate,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver
    };
  }
}

export default GetAccount;
