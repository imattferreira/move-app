import ConflictException from '~/application/exceptions/conflict-exception';
import Coord from './value-objects/coord';
import Identifier from './value-objects/identifier';

type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed';

class Ride {
  private id: Identifier;
  private passengerId: Identifier;
  private driverId: Identifier | null;
  private from: Coord;
  private to: Coord;

  constructor(
    id: string,
    passengerId: string,
    driverId: string | null,
    public status: RideStatus,
    readonly fare: number,
    readonly distance: number,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly date: Date
  ) {
    this.id = new Identifier(id);
    this.driverId = driverId ? new Identifier(driverId) : null;
    this.passengerId = new Identifier(passengerId);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  // Static Factory Method Pattern (GoF)
  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ): Ride {
    const id = Identifier.create();
    const driverId = null;
    const status = 'requested';
    const fare = 0;
    const distance = 0;
    const now = new Date();

    return new Ride(
      id.getValue(),
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

  attachDriver(driverId: string): void {
    this.driverId = new Identifier(driverId);
    this.status = 'accepted';
  }

  start(): void {
    if (this.status !== 'accepted') {
      throw new ConflictException('ride already started');
    }

    this.status = 'in_progress';
  }

  getId(): string {
    return this.id.getValue();
  }

  getDriverId(): string | null {
    return this.driverId?.getValue() || null;
  }

  getFrom(): Coord {
    return this.from;
  }

  getTo(): Coord {
    return this.to;
  }

  getPassengerId(): string {
    return this.passengerId.getValue();
  }
}

export default Ride;
