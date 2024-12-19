import { type Optional } from '~/utils/types';

type Account = {
  name: string;
  email: string;
  cpf: string;
  is_passenger: boolean;
  is_driver: boolean;
  car_plate: string | null;
  password: string;
};

export function makeAccountFactory(
  fieldsToOverride: Optional<Account>
): Account {
  return {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '475.646.550-11',
    is_passenger: false,
    is_driver: false,
    car_plate: fieldsToOverride.is_driver ? 'ABC1234' : null,
    password: '123456789',
    ...fieldsToOverride
  };
}
