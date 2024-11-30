import PositionsRepository from "~/application/repositories/positions-repository";
import Position from "~/domain/entities/position";
import DatabaseConnection from "~/infra/database/database-connection";
import { sql } from "~/infra/repositories/utils/query";

class PsqlPositionsRepository implements PositionsRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(position: Position): Promise<void> {
    const query = sql`
      INSERT INTO ccca.position (id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5);
    `;
    const params = [position.id, position.rideId, position.lat, position.long, position.date];

    await this.connection.query(query, params);
    await this.connection.close();
  }

  async findAllById(rideId: string): Promise<Position[]> {
    const query = sql`SELECT * FROM ccca.position WHERE ride_id = $1 ORDER BY date DESC;`;
    const params = [rideId];

    const [positions] = await this.connection.query(query, params);
    await this.connection.close();

    return positions.map((position: Record<string, any>) => (
      new Position(
        position.id,
        position.ride_id,
        position.lat,
        position.long,
        new Date(position.date)
    )));
  }
}

export default PsqlPositionsRepository;
