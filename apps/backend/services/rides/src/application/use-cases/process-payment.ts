import ConflictException from '~/application/exceptions/conflict-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import RidesRepository from '~/application/repositories/rides-repository';
import Transaction from '~/domain/entities/transaction';
import TransactionsRepository from '~/application/repositories/transactions-repository';
import { inject } from '~/infra/registry';

type Input = {
  rideId: string;
};

type Output = {
  transactionId: string;
};

class ProcessPayment {
  @inject('RidesRepository')
  private readonly ridesRepository!: RidesRepository;

  @inject('TransactionsRepository')
  private readonly transactionsRepository!: TransactionsRepository;

  async execute(input: Input): Promise<Output> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    if (ride.getStatus() !== 'completed') {
      throw new ConflictException('ride not finished yet');
    }

    const transaction = Transaction.create(ride.getId(), ride.getFare());

    await this.transactionsRepository.save(transaction);

    return {
      transactionId: transaction.getId()
    };
  }
}

export default ProcessPayment;
