import NotFoundException from '~/application/exceptions/not-found-exception';
import RidesGateway from '~/application/gateways/rides-gateway';
import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';

type Input = {
  rideId: string;
  amount: number;
};

class ProcessPayment {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly ridesGateway: RidesGateway
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesGateway.getById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    const transaction = Transaction.create(
      input.rideId,
      input.amount,
      'success'
    );

    await this.transactionsRepository.save(transaction);
  }
}

export default ProcessPayment;
