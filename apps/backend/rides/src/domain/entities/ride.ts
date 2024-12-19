import ConflictException from '~/application/exceptions/conflict-exception';
import Coord from '~/domain/value-objects/coord';
import DistanceCalculator from '~/domain/service/distance-calculator';
import { FareCalculatorFactory } from '~/domain/service/fare-calculator';
import Identifier from '~/domain/value-objects/identifier';
import Position from './position';

type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed';

class Ride {
  private readonly id: Identifier;
  private readonly passengerId: Identifier;
  private driverId: Identifier | null;
  private readonly from: Coord;
  private readonly to: Coord;
  private fare: number;
  private status: RideStatus;
  private distance: number;
  private date: Date;

  constructor(
    id: string,
    passengerId: string,
    driverId: string | null,
    status: RideStatus,
    fare: number,
    distance: number,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    date: Date
  ) {
    this.id = new Identifier(id);
    this.driverId = driverId ? new Identifier(driverId) : null;
    this.passengerId = new Identifier(passengerId);
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
    this.status = status;
    this.fare = fare;
    this.date = date;
    this.distance = distance;
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

  accept(driverId: string): void {
    if (this.status !== 'requested') {
      throw new ConflictException('ride already accepted');
    }

    this.driverId = new Identifier(driverId);
    this.status = 'accepted';
  }

  start(): void {
    if (this.status !== 'accepted') {
      throw new ConflictException('ride already started');
    }

    this.status = 'in_progress';
  }

  // TODO: test it
  finish(positions: Position[]): void {
    if (this.status !== 'in_progress') {
      throw new ConflictException('ride not started yet');
    }

    for (const [index, position] of positions.entries()) {
      const next = positions[index + 1];

      if (!next) {
        break;
      }

      const distance = DistanceCalculator.calculateDistanceBetweenPositions([
        position,
        next
      ]);
      const fareCalculator = FareCalculatorFactory.create(position.getDate());

      this.distance += distance;
      this.fare += fareCalculator.calculate(distance);
    }

    this.status = 'completed';
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

  getStatus(): RideStatus {
    return this.status;
  }

  getFare(): number {
    return this.fare;
  }

  getDistance(): number {
    return this.distance;
  }

  getDate(): Date {
    return this.date;
  }
}

export default Ride;
