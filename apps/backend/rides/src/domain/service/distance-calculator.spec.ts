import Coord from '~/domain/value-objects/coord';
import DistanceCalculator from './distance-calculator';
import Identifier from '~/domain/value-objects/identifier';
import Position from '~/domain/entities/position';

describe('DistanceCalculator', () => {
  it('should be able to calculate the distance between two coordinates', () => {
    const from = new Coord(-27.584905257808835, -48.545022195325124);
    const to = new Coord(-27.496887588317275, -48.522234807851476);

    const output = DistanceCalculator.calculateDistanceBetweenCoords(from, to);

    expect(output).toBe(10);
  });

  it('should be able to calculate the distance between two positions', () => {
    const positions = [
      Position.create(
        Identifier.create().getValue(),
        -27.584905257808835,
        -48.545022195325124
      ),
      Position.create(
        Identifier.create().getValue(),
        -27.496887588317275,
        -48.522234807851476
      )
    ];

    const output
      = DistanceCalculator.calculateDistanceBetweenPositions(positions);

    expect(output).toBe(10);
  });
});
