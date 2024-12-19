import { FareCalculatorFactory, NormalFareCalculator, OvernightFareCalculator, SundayFareCalculator } from './fare-calculator';

describe('FareCalculator', () => {
  it('should calculate the fare based on normal tax', () => {
    const input = 10;
    const fareCalculator = new NormalFareCalculator();

    const output = fareCalculator.calculate(input);

    expect(output).toBe(21.0);
  });

  it('should calculate the fare based on overnight tax', () => {
    const input = 10;
    const fareCalculator = new OvernightFareCalculator();

    const output = fareCalculator.calculate(input);

    expect(output).toBe(39.0);
  });

  it('should calculate the fare based on sunday tax', () => {
    const input = 10;
    const fareCalculator = new SundayFareCalculator();

    const output = fareCalculator.calculate(input);

    expect(output).toBe(50);
  });

  it('should choose correct calculator based on date', () => {
    const normal = new Date('2024-12-10T10:00:00');
    const sunday = new Date('2024-12-08T10:00:00');
    const overnight = new Date('2024-12-12T23:00:00');

    expect(FareCalculatorFactory.create(normal)).toBeInstanceOf(
      NormalFareCalculator
    );
    expect(FareCalculatorFactory.create(overnight)).toBeInstanceOf(
      OvernightFareCalculator
    );
    expect(FareCalculatorFactory.create(sunday)).toBeInstanceOf(
      SundayFareCalculator
    );
  });
});
