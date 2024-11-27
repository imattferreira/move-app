import crypto from 'node:crypto';

class Account {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate: string | null = null,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly password: string,
  ) {}

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string | null = null,
    isPassenger: boolean,
    isDriver: boolean,
    password: string,
  ) {
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
