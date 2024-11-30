import Position from "../../domain/entities/position";

interface PositionsRepository {
  save(position: Position): Promise<void>;
  findAllByRideId(rideId: string): Promise<Position[]>;
}

export default PositionsRepository;
