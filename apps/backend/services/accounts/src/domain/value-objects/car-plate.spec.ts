import CarPlate from './car-plate';
import InvalidException from '~/application/exceptions/invalid-exception';

describe('CarPlate', () => {
  it('should be able to create a car plate', () => {
    const input = 'ABC1234';

    const carPlate = new CarPlate(input);

    expect(carPlate.getValue()).toBe(input);
  });

  it('should not be able to create a invalid car plate', () => {
    const input = 'AAAA';

    expect(
      () => new CarPlate(input)
    ).toThrow(new InvalidException('invalid [carPlate] field'));
  });
});
