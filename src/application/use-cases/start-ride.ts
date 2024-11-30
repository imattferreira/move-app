import RidesRepository from "~/application/repositories/rides-repository";

interface Input {
  rideId: string;
}

class StartRide {
  constructor(private readonly ridesRepository: RidesRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new Error('ride not found');
    }

    if (ride.status !== 'accepted') {
      throw new Error('ride already started');
    }

    ride.start();

    await this.ridesRepository.update(ride);
  }
}

export default StartRide;
