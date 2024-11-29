import pgp from 'pg-promise';
import Ride from '../entities/ride';
import { sql } from '../utils/query';

export default interface RidesRepository {
  save(ride: Ride): Promise<void>;
  findByRideId(rideId: string): Promise<Ride | null>;
  findLastRideOfPassenger(passengerId: string): Promise<Ride | null>;
}

export class PsqlRidesRepository implements RidesRepository {
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
    // TODO: fix duplicated connection warnings
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app');

    await connection.query(query, params);
    await connection.$pool.end();
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    const query = sql`SELECT * FROM ccca.ride WHERE ride_id = $1`;
    const params = [rideId];
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app');

    const [ride] = await connection.query(query, params);
    await connection.$pool.end();

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
      new Date(ride.date),
    );
  }

  async findLastRideOfPassenger(passengerId: string): Promise<Ride | null> {
    const query = sql`
      SELECT * FROM ccca.ride
      WHERE passenger_id = $1
      ORDER BY date DESC
      LIMIT 1;
    `;
    const params = [passengerId];
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app');

    const [ride] = await connection.query(query, params);
    await connection.$pool.end();

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
      new Date(ride.date),
    );
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

  async findLastRideOfPassenger(passengerId: string): Promise<Ride | null> {
    const ride = this.stored
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .find((ride) => ride.passengerId === passengerId);

    return ride || null;
  }
}
