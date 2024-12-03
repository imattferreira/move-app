import Email from './email';
import InvalidException from '~/application/exceptions/invalid-exception';

describe('Email', () => {
  it('should be able to create a email', () => {
    const input = 'john@doe.com';

    const email = new Email(input);

    expect(email.getValue()).toBe(input);
  });

  it('should not be able to create a invalid email', () => {
    const input = 'john122@';

    expect(
      () => new Email(input)
    ).toThrow(new InvalidException('invalid [email] field'));
  });
});
