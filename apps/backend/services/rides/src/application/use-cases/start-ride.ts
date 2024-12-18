import NotFoundException from '~/application/exceptions/not-found-exception';
import RidesRepository from '~/application/repositories/rides-repository';
import { inject } from '~/infra/registry';

type Input = {
  rideId: string;
};

class StartRide {
  @inject('RidesRepository')
  private readonly ridesRepository!: RidesRepository;

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    ride.start();

    await this.ridesRepository.update(ride);
  }
}

export default StartRide;
