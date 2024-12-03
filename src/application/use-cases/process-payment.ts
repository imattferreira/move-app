import NotFoundException from '../exceptions/not-found-exception';
import RidesRepository from '../repositories/rides-repository';

type Input = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};

class ProcessPayment {
  constructor(private readonly ridesRepository: RidesRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    // TODO: finish it
  }
}

export default ProcessPayment;
