import InvalidException from '~/application/exceptions/invalid-exception';

class CarPlate {
  private readonly value: string | null;

  constructor(carPlate: string | null) {
    if (carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
      throw new InvalidException('invalid [carPlate] field');
    }

    this.value = carPlate;
  }

  getValue(): string | null {
    return this.value;
  }
}

export default CarPlate;
