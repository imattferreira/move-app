import Cpf from './cpf';
import InvalidException from '~/application/exceptions/invalid-exception';

describe('validateCpf', () => {
  it('should validate a CPF with a digit different of zero', () => {
    // Given
    const input = '97456321558';
    // When
    const cpf = new Cpf(input);
    // Then
    expect(cpf.getValue()).toBe(input);
  });

  it('should validate a CPF with zero as the second digit', () => {
    const input = '71428793860';

    const cpf = new Cpf(input);

    expect(cpf.getValue()).toBe(input);
  });

  it('should validate a CPF with zero as the first digit', () => {
    const input = '87748248800';

    const cpf = new Cpf(input);

    expect(cpf.getValue()).toBe(input);
  });

  it('should not validate a CPF with less 11 characters', () => {
    const input = '9745632155';

    expect(
      () => new Cpf(input)
    ).toThrow(new InvalidException('invalid [cpf] field'));
  });

  it('should not validate a CPF when all characters are the same', () => {
    const input = '11111111111';

    expect(
      () => new Cpf(input)
    ).toThrow(new InvalidException('invalid [cpf] field'));
  });

  it('should not validate a CPF with letters', () => {
    const input = '97a56321558';

    expect(
      () => new Cpf(input)
    ).toThrow(new InvalidException('invalid [cpf] field'));
  });
});
