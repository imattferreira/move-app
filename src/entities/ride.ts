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
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    const id = crypto.randomUUID();
    const driverId = null;
    const status = 'requested';
    const fare = 0;
    const distance = 0;
    const now = new Date();

    return new Ride(
      id,
      passengerId,
      driverId,
      status,
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
