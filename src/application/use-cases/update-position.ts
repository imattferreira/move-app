import PositionsRepository from "../repositories/positions-repository";
import RidesRepository from "../repositories/rides-repository";

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
    // TODO
  }
}

export default UpdatePosition;
