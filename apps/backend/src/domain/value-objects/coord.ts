import InvalidException from '~/application/exceptions/invalid-exception';

class Coord {
  private readonly lat: number;
  private readonly long: number;

  constructor(lat: number, long: number) {
    if (lat < -90 || lat > 90) {
      throw new InvalidException('invalid [lat] field');
    }

    if (long < -180 || long > 180) {
      throw new InvalidException('invalid [long] field');
    }

    this.lat = lat;
    this.long = long;
  }

  getLat(): number {
    return this.lat;
  }

  getLong(): number {
    return this.long;
  }
}

export default Coord;
