import RidesRepository from '~/application/repositories/rides-repository';
import NotFoundException from '~/application/exceptions/not-found-exception';

type Input = {
  rideId: string;
};

class StartRide {
  constructor(private readonly ridesRepository: RidesRepository) {}

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
