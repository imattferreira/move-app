import Position from '~/domain/entities/position';
import PositionsRepository from '~/application/repositories/positions-repository';

class PositionsRepositoryInMemory implements PositionsRepository {
  private stored: Position[];

  constructor() {
    this.stored = [];
  }

  async save(position: Position): Promise<void> {
    this.stored.push(position);
  }

  async findAllById(rideId: string): Promise<Position[]> {
    return this.stored.filter(position => position.getRideId() === rideId);
  }
}

export default PositionsRepositoryInMemory;
