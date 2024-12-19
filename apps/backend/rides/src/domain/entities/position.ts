import Coord from '~/domain/value-objects/coord';
import Identifier from '~/domain/value-objects/identifier';

class Position {
  private readonly id: Identifier;
  private readonly rideId: Identifier;
  private readonly coord: Coord;
  private readonly date: Date;

  constructor(
    id: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date
  ) {
    this.id = new Identifier(id);
    this.rideId = new Identifier(rideId);
    this.coord = new Coord(lat, long);
    this.date = date;
  }

  static create(rideId: string, lat: number, long: number, date?: Date) {
    const id = Identifier.create();
    const now = date || new Date();

    return new Position(id.getValue(), rideId, lat, long, now);
  }

  getId(): string {
    return this.id.getValue();
  }

  getRideId(): string {
    return this.rideId.getValue();
  }

  getCoord(): Coord {
    return this.coord;
  }

  getDate(): Date {
    return this.date;
  }
}

export default Position;
