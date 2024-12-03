import Position from './position';

describe('Position', () => {
  it('should be able to create a position', () => {
    const input = {
      rideId: Math.random().toString(),
      lat: 10,
      long: 20
    };

    const position = Position.create(
      input.rideId,
      input.lat,
      input.long
    );

    expect(position.getId()).toBeDefined();
    expect(position.getRideId()).toBe(input.rideId);
    expect(position.getCoord().getLat()).toBe(input.lat);
    expect(position.getCoord().getLong()).toBe(input.long);
    expect(position.getDate()).toBeInstanceOf(Date);
  });
});
