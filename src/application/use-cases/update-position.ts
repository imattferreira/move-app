import Position from "~/domain/entities/position";
import PositionsRepository from "~/application/repositories/positions-repository";
import RidesRepository from "~/application/repositories/rides-repository";

interface Input {
  rideId: string;
  lat: number;
  long: number;
}

class UpdatePosition {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new Error('ride not found');
    }

    if (ride.status !== 'in_progress') {
      throw new Error('ride is not in progress');
    }

    const position = Position.create(input.rideId, input.lat, input.long);

    await this.positionsRepository.save(position);
  }
}

export default UpdatePosition;
