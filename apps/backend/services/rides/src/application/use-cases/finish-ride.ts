import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepository from '~/application/repositories/positions-repository';
import QueueMediator from '../mediators/queue-mediator';
import RidesRepository from '~/application/repositories/rides-repository';

type Input = {
  rideId: string;
};

class FinishRide {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly ridesRepository: RidesRepository,
    private readonly queueMediator: QueueMediator
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    const positions = await this.positionsRepository.getAllByRideId(
      ride.getId()
    );

    ride.finish(positions);

    await this.ridesRepository.update(ride);
    // TODO: test it
    this.queueMediator.notify(
      'process-ride-payment',
      { rideId: ride.getId(), amount: ride.getFare() }
    );
  }
}

export default FinishRide;
