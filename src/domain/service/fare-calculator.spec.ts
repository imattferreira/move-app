import FareCalculator from './fare-calculator';

describe('FareCalculator', () => {
  it('should calculate the right fare based on distance', () => {
    const input = 10;

    const output = FareCalculator.calculate(input);

    expect(output).toBe(21.0);
  });
});
