import Ride from '~/domain/entities/ride';
import { sql } from '~/infra/repositories/utils/query';
import DatabaseConnection from '~/infra/database/database-connection';
import RidesRepository from '~/application/repositories/rides-repository';

/**
* DAO -> deals directly with database tables (similar with ORMs) and
* returns DTOs.
* Repository Pattern -> intermediary between entities and database and returns
* the restored entity.
*/
class PsqlRidesRepository implements RidesRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  // SRP - Single Responsability Principle
  async save(ride: Ride): Promise<void> {
    const query = sql`
      INSERT INTO ccca.ride (
      ride_id,
      passenger_id,
      driver_id,
      status,
      fare,
      distance,
      from_lat,
      from_long,
      to_lat,
      to_long,
      date
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
    );`;
    const params = [
      ride.id,
      ride.passengerId,
      ride.driverId,
      ride.status,
      ride.fare,
      ride.distance,
      ride.fromLat,
      ride.fromLong,
      ride.toLat,
      ride.toLong,
      ride.date
    ];

    await this.connection.query(query, params);
  }

  async findById(rideId: string): Promise<Ride | null> {
    const query = sql`SELECT * FROM ccca.ride WHERE ride_id = $1`;
    const params = [rideId];

    const [ride] = await this.connection.query(query, params);

    if (!ride) {
      return null;
    }

    return new Ride(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      ride.status,
      Number(ride.fare),
      Number(ride.distance),
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      new Date(ride.date)
    );
  }

  async hasActiveRideOfDriver(driverId: string): Promise<boolean> {
    const query = sql`
      SELECT EXISTS (
        SELECT 1 FROM ccca.ride
        WHERE driver_id = $1 AND status <> 'completed'
      );
    `;
    const params = [driverId];

    const [{ exists }] = await this.connection.query(query, params);

    return exists;
  }

  async hasActiveRideOfPassenger(passengerId: string): Promise<boolean> {
    const query = sql`
      SELECT EXISTS (
        SELECT 1 FROM ccca.ride
        WHERE passenger_id = $1 AND status <> 'completed'
      );
    `;
    const params = [passengerId];

    const [{ exists }] = await this.connection.query(query, params);

    return exists;
  }

  async update(ride: Ride): Promise<void> {
    const query = sql`
     UPDATE ccca.ride
     SET
     driver_id = $1,
     status = $2,
     distance = $3,
     WHERE ride_id = $4
    `;
    const params = [ride.driverId, ride.status, ride.distance, ride.id];

    await this.connection.query(query, params);
  }
}

export default PsqlRidesRepository;
