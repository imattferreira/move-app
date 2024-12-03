import Position from '~/domain/entities/position';

interface PositionsRepository {
  save(position: Position): Promise<void>;
  getAllByRideId(rideId: string): Promise<Position[]>;
}

export default PositionsRepository;
