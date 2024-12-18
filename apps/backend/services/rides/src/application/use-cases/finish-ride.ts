import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepository from '~/application/repositories/positions-repository';
import Queue from '~/application/queues/queue';
import RidesRepository from '~/application/repositories/rides-repository';
import { inject } from '~/infra/registry';

type Input = {
  rideId: string;
};

class FinishRide {
  @inject('Queue')
  private readonly queue!: Queue;

  @inject('PositionsRepository')
  private readonly positionsRepository!: PositionsRepository;

  @inject('RidesRepository')
  private readonly ridesRepository!: RidesRepository;

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
    this.queue.publish('ride-finished', { rideId: ride.getId() });
  }
}

export default FinishRide;
