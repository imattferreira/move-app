import { camelfy, snakefy } from './object';

describe('snakefy', () => {
  it('should parse camel-case keys to snake-case', () => {
    const input = {
      name: 'John Doe',
      age: 32,
      carPlate: 'ABC-123',
      address: {
        street: 'Wall Street',
        streetNumber: 123,
      },
      children: [
        {
          name: 'Marie Curie',
          age: 10,
          school: {
            address: {
              street: 'Wall Street',
              streetNumber: 123,
            },
            deggree: 2,
            hasSibling: false,
          }
        }
      ]
    };
    const expected = {
      name: 'John Doe',
      age: 32,
      car_plate: 'ABC-123',
      address: {
        street: 'Wall Street',
        street_number: 123,
      },
      children: [
        {
          name: 'Marie Curie',
          age: 10,
          school: {
            address: {
              street: 'Wall Street',
              street_number: 123,
            },
            deggree: 2,
            has_sibling: false,
          }
        }
      ]
    };

    const output = snakefy(input);

    expect(output).toStrictEqual(expected);
  });
});

describe('camelfy', () => {
  it('should parse snake-case keys to camel-case', () => {
    const input = {
      name: 'John Doe',
      age: 32,
      car_plate: 'ABC-123',
      address: {
        street: 'Wall Street',
        street_number: 123,
      },
      children: [
        {
          name: 'Marie Curie',
          age: 10,
          school: {
            address: {
              street: 'Wall Street',
              street_number: 123,
            },
            deggree: 2,
            has_sibling: false,
          }
        }
      ]
    };
    const expected = {
      name: 'John Doe',
      age: 32,
      carPlate: 'ABC-123',
      address: {
        street: 'Wall Street',
        streetNumber: 123,
      },
      children: [
        {
          name: 'Marie Curie',
          age: 10,
          school: {
            address: {
              street: 'Wall Street',
              streetNumber: 123,
            },
            deggree: 2,
            hasSibling: false,
          }
        }
      ]
    };

    const output = camelfy(input);

    expect(output).toStrictEqual(expected);
  });
});
