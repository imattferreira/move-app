import CarPlate from './value-objects/car-plate';
import ConflictException from '~/application/exceptions/conflict-exception';
import Cpf from './value-objects/cpf';
import Email from './value-objects/email';
import Identifier from './value-objects/identifier';
import Name from './value-objects/name';
import Password from './value-objects/password';

// Entity
class Account {
  private id: Identifier;
  private name: Name;
  private email: Email;
  private cpf: Cpf;
  private carPlate: CarPlate;
  private password: Password;

  constructor(
    id: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string | null = null,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    password: string
  ) {
    if (isPassenger && isDriver) {
      throw new ConflictException('account should be passenger or driver');
    }

    if (isPassenger && carPlate) {
      throw new ConflictException('passenger cannot have a car plate');
    }

    if (isDriver && !carPlate) {
      throw new ConflictException('driver should have a car plate');
    }

    this.id = new Identifier(id);
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.carPlate = new CarPlate(carPlate);
    this.password = new Password(password);
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
    const id = Identifier.create();

    return new Account(
      id.getValue(),
      name,
      email,
      cpf,
      carPlate,
      isPassenger,
      isDriver,
      password
    );
  }

  getId(): string {
    return this.id.getValue();
  }

  getName(): string {
    return this.name.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getCpf(): string {
    return this.cpf.getValue();
  }

  getCarPlate(): string | null {
    return this.carPlate.getValue();
  }

  getPassword(): string {
    return this.password.getValue();
  }
}

export default Account;
