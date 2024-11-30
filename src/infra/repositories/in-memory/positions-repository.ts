import PositionsRepository from "~/application/repositories/positions-repository";
import Position from "~/domain/entities/position";

class PositionsRepositoryInMemory implements PositionsRepository {
  private stored: Position[];

  constructor() {
    this.stored = [];
  }

  async save(position: Position): Promise<void> {
    this.stored.push(position);
  }

  async findAllById(rideId: string): Promise<Position[]> {
    return this.stored.filter((position) => position.rideId === rideId);
  }
}

export default PositionsRepositoryInMemory;
