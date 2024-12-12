import InvalidException from '~/application/exceptions/invalid-exception';
import Name from './name';

describe('Name', () => {
  it('should be able to create a name', () => {
    const input = 'John Doe';

    const name = new Name(input);

    expect(name.getValue()).toBe(input);
  });

  it('should not be able to create a invalid name', () => {
    const input = 'JJ';

    expect(
      () => new Name(input)
    ).toThrow(new InvalidException('invalid [name] field'));
  });
});
