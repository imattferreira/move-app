import InvalidException from '~/application/exceptions/invalid-exception';

const CPF_VALID_LENGTH = 11;
const FIRST_DIGIT_FACTOR = 10;
const SECOND_DIGIT_FACTOR = 11;

class Cpf {
  private readonly value: string;

  constructor(cpf: string) {
    if (!this.isCpfValid(cpf)) {
      throw new InvalidException('invalid [cpf] field');
    }

    this.value = cpf;
  }

  getValue(): string {
    return this.value;
  }

  private isCpfValid(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== CPF_VALID_LENGTH) {
      return false;
    }

    if (this.allDigitsTheSame(cpf)) {
      return false;
    }

    const digit1 = this.calculateDigit(cpf, FIRST_DIGIT_FACTOR);
    const digit2 = this.calculateDigit(cpf, SECOND_DIGIT_FACTOR);

    return `${digit1}${digit2}` === this.extractDigit(cpf);
  }

  private allDigitsTheSame(cpf: string): boolean {
    return cpf.split('').every(digit => digit === cpf[0]);
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0;

    for (const digit of cpf) {
      if (factor > 1) {
        total += parseInt(digit) * factor--;
      }
    }

    const remainder = total % 11;

    return (remainder < 2) ? 0 : 11 - remainder;
  }

  private extractDigit(cpf: string): string {
    return cpf.slice(9);
  }
}

export default Cpf;
