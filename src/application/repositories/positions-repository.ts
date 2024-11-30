import Position from "~/domain/entities/position";

interface PositionsRepository {
  save(position: Position): Promise<void>;
  findAllById(rideId: string): Promise<Position[]>;
}

export default PositionsRepository;
