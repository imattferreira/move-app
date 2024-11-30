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

    expect(position.id).toBeDefined();
    expect(position.rideId).toBe(input.rideId);
    expect(position.lat).toBe(input.lat);
    expect(position.long).toBe(input.long);
    expect(position.date).toBeInstanceOf(Date);
  });
});
