import { makeRequest } from "./utils";

describe('POST /rides', () => {
  it('should be able request a new ride', async () => {
    const signupRes = await makeRequest<{ account_id: string }>('/signup', {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      is_passenger: true,
      car_plate: 'ABC1234',
      password: '123456'
    });

    const passengerId = signupRes.data.account_id;

    const input = {
      passengerId: passengerId,
      fromLat: 0,
      fromLong: 0,
      toLat: 0,
      toLong: 0
    };

    const requestRideRes = await makeRequest<{ ride_id: string }>('/rides', input);

    expect(requestRideRes.status).toBe(201);
    expect(requestRideRes.data.ride_id).toBeDefined();

    const registeredRideRes = await makeRequest<Record<string, unknown>>(`/rides/${requestRideRes.data.ride_id}`);

    expect(registeredRideRes.status).toBe(200);
    expect(registeredRideRes.data?.status).toBe('requested');
    expect(registeredRideRes.data?.fare).toBe(0);
    expect(registeredRideRes.data?.distance).toBe(0);
    expect(registeredRideRes.data?.from_lat).toBe(input.fromLat);
    expect(registeredRideRes.data?.from_long).toBe(input.fromLong);
    expect(registeredRideRes.data?.to_lat).toBe(input.toLat);
    expect(registeredRideRes.data?.to_long).toBe(input.toLong);
    expect(registeredRideRes.data?.date).toBeDefined();
  });

  it('should not be able request a new ride when passenger already have a ride in progress', async () => {
    const signupRes = await makeRequest<{ account_id: string }>('/signup', {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      is_passenger: true,
      car_plate: 'ABC1234',
      password: '123456'
    });

    const passengerId = signupRes.data.account_id;

    const input = {
      passengerId: passengerId,
      fromLat: 0,
      fromLong: 0,
      toLat: 0,
      toLong: 0
    };

    await makeRequest<{ ride_id: string }>('/rides', input);
    const requestRideRes = await makeRequest<{ message: string }>('/rides', input);

    expect(requestRideRes.status).toBe(422);
    expect(requestRideRes.data.message).toBe('account already have a ride in progress');
  });
});
