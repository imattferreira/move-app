import crypto from 'node:crypto';

class Position {
  constructor(
    readonly id: string,
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
    readonly date: Date
  ) {}

  static create(rideId: string, lat: number, long: number) {
    const id = crypto.randomUUID();
    const now = new Date();

    return new Position(id, rideId, lat, long, now);
  }
}

export default Position;
