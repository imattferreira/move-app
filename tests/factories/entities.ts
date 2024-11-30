import { type Optional } from '~/utils/types';

type Account = {
  name: string,
  email: string,
  cpf: string,
  is_passenger: boolean,
  is_driver: boolean,
  car_plate: string,
  password: string,
}

type Ride = {
  passenger_id: string;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
}

export function makeAccountFactory(
  fieldsToOverride: Optional<Account>
): Account {
  return {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '475.646.550-11',
    is_passenger: false,
    is_driver: false,
    car_plate: 'ABC1234',
    password: '123456',
    ...fieldsToOverride
  };
}

export function makeRideFactory(fieldsToOverride: Optional<Ride>): Ride {
  return {
    passenger_id: Math.random().toString(),
    from_lat: -27.584905257808835,
		from_long: -48.545022195325124,
		to_lat: -27.496887588317275,
		to_long: -48.522234807851476,
    ...fieldsToOverride
  };
}
