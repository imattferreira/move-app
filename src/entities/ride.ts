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
    readonly date: Date
  ) { }

  // Static Factory Method Pattern (GoF)
  static create(
    passengerId: string,
    fare: number,
    distance: number,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
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
      fromLat,
      fromLong,
      toLat,
      toLong,
      now
    );
  }
}

export default Ride;
