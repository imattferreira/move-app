export type SignUpInput = {
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string | null;
};

export type SignUpOutput = {
  accountId: string;
};

export type GetAccountOutput = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string | null;
};

interface AccountsGateway {
  signup(data: SignUpInput): Promise<SignUpOutput>;
  getById(accountId: string): Promise<GetAccountOutput | null>;
}

export default AccountsGateway;
