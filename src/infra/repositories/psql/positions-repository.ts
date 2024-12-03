import DatabaseConnection from '~/infra/database/database-connection';
import Position from '~/domain/entities/position';
import PositionsRepository from '~/application/repositories/positions-repository';
import { sql } from '~/infra/repositories/utils/query';

class PsqlPositionsRepository implements PositionsRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(position: Position): Promise<void> {
    const query = sql`
      INSERT INTO ccca.position (
        position_id,
        ride_id,
        lat,
        long,
        date
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
        );
    `;
    const params = [
      position.getId(),
      position.getRideId(),
      position.getCoord().getLat(),
      position.getCoord().getLong(),
      position.getDate()
    ];

    await this.connection.query(query, params);
  }

  async getAllByRideId(rideId: string): Promise<Position[]> {
    const query = sql`
      SELECT * FROM ccca.position
      WHERE ride_id = $1 ORDER BY date DESC;
    `;
    const params = [rideId];

    const [positions] = await this.connection.query(query, params);

    return positions.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (position: Record<string, any>) =>
        new Position(
          position.id,
          position.ride_id,
          position.lat,
          position.long,
          new Date(position.date)
        )
    );
  }
}

export default PsqlPositionsRepository;
