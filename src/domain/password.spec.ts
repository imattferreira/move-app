import InvalidException from '~/application/exceptions/invalid-exception';
import Password from './value-objects/password';

describe('Password', () => {
  it('should be able to create a password', () => {
    const input = '12345678';

    const password = new Password(input);

    expect(password.getValue()).toBe(input);
  });

  it(
    'should not be able to create a password with less than 8 characters',
    () => {
      expect(
        () => new Password('123')
      ).toThrow(new InvalidException('invalid [password] field'));
    }
  );
});
