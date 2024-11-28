import crypto from 'node:crypto';

type RideStatus = 'requested' | 'progress' | 'completed';

class Ride {
  constructor(
    readonly id: string,
    readonly passengerId: string,
    readonly driverId: string | null,
    readonly status: RideStatus,
    readonly fare: number,
    readonly distance: number,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date,
  ) {}

  static create(
    passengerId: string,
    fare: number,
    distance: number,
    from_lat: number,
    from_long: number,
    to_lat: number,
    to_long: number,
  ): Ride {
    const id = crypto.randomUUID();
    const now = new Date();

    return new Ride(
      id,
      passengerId,
      null,
      'requested',
      fare,
      distance,
      from_lat,
      from_long,
      to_lat,
      to_long,
      now
    );
  }
}

export default Ride;
