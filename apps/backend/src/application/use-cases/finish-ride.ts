import DistanceCalculator from '~/domain/service/distance-calculator';
import FareCalculator from '~/domain/service/fare-calculator';
import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepository from '~/application/repositories/positions-repository';
import RidesRepository from '~/application/repositories/rides-repository';

type Input = {
  rideId: string;
};

class FinishRide {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    const positions = await this.positionsRepository.getAllByRideId(
      ride.getId()
    );

    const distance = DistanceCalculator.calculateDistanceBetweenPositions(
      positions
    );
    const fare = FareCalculator.calculate(distance);

    ride.setDistance(distance);
    ride.setFare(fare);
    ride.finish();

    await this.ridesRepository.update(ride);
  }
}

export default FinishRide;
