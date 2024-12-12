import { faker } from '@faker-js/faker';

// TODO: implement to all tests
class Faker {
  static carPlate(): string {
    const carPlates = [
      'MXU1519',
      'HSO8026',
      'MTW9449',
      'MRC4637',
      'MOB3764',
      'MVA6972',
      'NEX5965',
      'MAJ0385',
      'NEU8447',
      'LHA8060'
    ];
    const i = faker.number.int({ min: 0, max: carPlates.length - 1 });

    return carPlates[i];
  }

  static coordinate(): { lat: number; long: number } {
    const lat = faker.location.latitude();
    const long = faker.location.longitude();

    return { lat, long };
  }

  static cpf(): string {
    const cpfs = [
      '274.433.190-29',
      '458.463.750-49',
      '022.192.450-71',
      '400.974.760-99',
      '674.826.770-62',
      '516.973.400-08',
      '144.824.160-02',
      '293.204.480-00',
      '717.770.030-75',
      '509.918.400-62'
    ];
    const i = faker.number.int({ min: 0, max: cpfs.length - 1 });

    return cpfs[i];
  }

  static date(): string {
    return faker.date.anytime().toISOString();
  }

  static email(): string {
    return faker.internet.email();
  }

  static fullname(): string {
    return faker.person.fullName();
  }

  static name(): string {
    return faker.person.firstName();
  }

  static password(): string {
    return faker.internet.password();
  }

  static price(): number {
    return parseFloat(faker.commerce.price());
  }
}

export default Faker;
