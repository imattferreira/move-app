import Coord from './coord';
import InvalidException from '~/application/exceptions/invalid-exception';

describe('Coord', () => {
  it('should be able to create a coordinate', () => {
    const input = {
      lat: 10,
      long: 20
    };

    const coord = new Coord(input.lat, input.long);

    expect(coord.getLat()).toBe(input.lat);
    expect(coord.getLong()).toBe(input.long);
  });

  it('should not be able to create coordinate with invalid latitude', () => {
    expect(
      () => new Coord(200, 100)
    ).toThrow(new InvalidException('invalid [lat] field'));
  });

  it('should not be able to create coordinate with invalid longitude', () => {
    expect(
      () => new Coord(50, 200)
    ).toThrow(new InvalidException('invalid [long] field'));
  });
});
