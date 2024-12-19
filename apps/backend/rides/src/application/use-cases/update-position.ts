import ConflictException from '~/application/exceptions/conflict-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Position from '~/domain/entities/position';
import PositionsRepository from '~/application/repositories/positions-repository';
import RidesRepository from '~/application/repositories/rides-repository';
import { inject } from '~/infra/registry';

type Input = {
  rideId: string;
  lat: number;
  long: number;
  // TODO: test it
  date?: Date;
};

class UpdatePosition {
  @inject('PositionsRepository')
  private readonly positionsRepository!: PositionsRepository;

  @inject('RidesRepository')
  private readonly ridesRepository!: RidesRepository;

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    if (ride.getStatus() !== 'in_progress') {
      throw new ConflictException('ride is not in progress');
    }

    const position = Position.create(
      input.rideId,
      input.lat,
      input.long,
      input.date
    );

    await this.positionsRepository.save(position);
  }
}

export default UpdatePosition;
