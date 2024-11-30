import Position from "../../domain/entities/position";

interface PositionsRepository {
  save(position: Position): Promise<void>;
}

export default PositionsRepository;
