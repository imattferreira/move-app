import ConflictException from "~/application/exceptions/conflict-exception";
import NotFoundException from "~/application/exceptions/not-found-exception";
import Transaction from "~/domain/entities/transaction";
import TransactionsRepository from "~/application/repositories/transactions-repository";
import { inject } from "~/infra/registry";
import RidesGateway from "~/application/gateways/rides-gateway";

type Input = {
  rideId: string;
};

type Output = {
  transactionId: string;
};

class ProcessPayment {
  @inject("RidesGateway")
  private readonly ridesGateway!: RidesGateway;

  @inject("TransactionsRepository")
  private readonly transactionsRepository!: TransactionsRepository;

  async execute(input: Input): Promise<Output> {
    const ride = await this.ridesGateway.getById(input.rideId);

    if (!ride) {
      throw new NotFoundException("ride not found");
    }

    if (ride.status !== "completed") {
      throw new ConflictException("ride not finished yet");
    }

    const transaction = Transaction.create(ride.id, ride.fare);

    await this.transactionsRepository.save(transaction);

    return {
      transactionId: transaction.getId(),
    };
  }
}

export default ProcessPayment;
