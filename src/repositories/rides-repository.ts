import pgp from 'pg-promise';
import Ride from '../entities/ride';
import { sql } from '../utils/query';
import DatabaseConnection from '../adapters/database-connection';

// LSP - Liskov Substitution Principle
export default interface RidesRepository {
  save(ride: Ride): Promise<void>;
  findByRideId(rideId: string): Promise<Ride | null>;
  hasActiveRideOfPassenger(passengerId: string): Promise<boolean>;
};

/**
* DAO -> deals directly with database tables (similar with ORMs) and
* returns DTOs.
* Repository Pattern -> intermediary between entities and database and returns
* the restored entity.
*/
export class PsqlRidesRepository implements RidesRepository {
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
    await this.connection.close();
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    const query = sql`SELECT * FROM ccca.ride WHERE ride_id = $1`;
    const params = [rideId];

    const [ride] = await this.connection.query(query, params);
    await this.connection.close();

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

  async hasActiveRideOfPassenger(passengerId: string): Promise<boolean> {
    const query = sql`
      SELECT EXISTS (
        SELECT 1 FROM ccca.ride
        WHERE passenger_id = $1 AND status <> 'completed'
      );
    `;
    const params = [passengerId];

    const [{ exists }] = await this.connection.query(query, params);
    await this.connection.close();

    return exists;
  }
}

export class RidesRepositoryInMemory implements RidesRepository {
  private stored: Ride[];

  constructor() {
    this.stored = [];
  }

  async save(ride: Ride): Promise<void> {
    this.stored.push(ride);
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    const ride = this.stored.find((ride) => ride.id === rideId);

    return ride || null;
  }

  async hasActiveRideOfPassenger(passengerId: string): Promise<boolean> {
    const ride = this.stored
      .find((ride) => ride.passengerId === passengerId && ride.status !== 'completed');

    return !!ride;
  }
}
