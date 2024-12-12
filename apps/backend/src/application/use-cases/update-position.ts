import ConflictException from '~/application/exceptions/conflict-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Position from '~/domain/entities/position';
import PositionsRepository from '~/application/repositories/positions-repository';
import RidesRepository from '~/application/repositories/rides-repository';

type Input = {
  rideId: string;
  lat: number;
  long: number;
};

class UpdatePosition {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    if (ride.getStatus() !== 'in_progress') {
      throw new ConflictException('ride is not in progress');
    }

    const position = Position.create(input.rideId, input.lat, input.long);

    await this.positionsRepository.save(position);
  }
}

export default UpdatePosition;
