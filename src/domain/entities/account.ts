import ConflictException from '~/application/exceptions/conflict-exception';
import InvalidException from '~/application/exceptions/invalid-exception';
import crypto from 'node:crypto';
import validateCpf from '~/domain/validateCpf';

// Entity
class Account {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate: string | null = null,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly password: string
  ) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      throw new InvalidException('invalid [name] field');
    }

    if (!email.match(/^(.+)@(.+)$/)) {
      throw new InvalidException('invalid [email] field');
    }

    if (!validateCpf(cpf)) {
      throw new InvalidException('invalid [cpf] field');
    }

    if (isPassenger && isDriver) {
      throw new ConflictException('account should be passenger or driver');
    }

    if (isPassenger && carPlate) {
      throw new ConflictException('passenger cannot have a car plate');
    }

    if (isDriver && !carPlate?.match(/[A-Z]{3}[0-9]{4}/)) {
      throw new InvalidException('invalid [carPlate] field');
    }
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string | null = null,
    isPassenger: boolean,
    isDriver: boolean,
    password: string
  ): Account {
    const id = crypto.randomUUID();

    return new Account(
      id,
      name,
      email,
      cpf,
      carPlate,
      isPassenger,
      isDriver,
      password
    );
  }
}

export default Account;
