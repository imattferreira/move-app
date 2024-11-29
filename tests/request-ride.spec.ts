import { makeAccountFactory, makeRideFactory } from "./factories/entities";
import { makeRequest } from "./utils";

describe('POST /rides', () => {
  it('should be able request a new ride', async () => {
    const signupRes = await makeRequest<{ account_id: string }>(
        '/signup',
        makeAccountFactory({
        is_passenger: true,
        is_driver: false,
      })
    );

    const passengerId = signupRes.data.account_id;
    const input = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>('/rides', input);

    expect(requestRideRes.status).toBe(201);
    expect(requestRideRes.data.ride_id).toBeDefined();

    const registeredRideRes = await makeRequest<Record<string, unknown>>(`/rides/${requestRideRes.data.ride_id}`);

    expect(registeredRideRes.status).toBe(200);
    expect(registeredRideRes.data?.status).toBe('requested');
    expect(registeredRideRes.data?.fare).toBe(0);
    expect(registeredRideRes.data?.distance).toBe(0);
    expect(registeredRideRes.data?.from_lat).toBe(input.from_lat);
    expect(registeredRideRes.data?.from_long).toBe(input.from_long);
    expect(registeredRideRes.data?.to_lat).toBe(input.to_lat);
    expect(registeredRideRes.data?.to_long).toBe(input.to_long);
    expect(registeredRideRes.data?.date).toBeDefined();
  });

  it('should not be able request a new ride when passenger already have a ride in progress', async () => {
    const signupRes = await makeRequest<{ account_id: string }>(
      '/signup',
      makeAccountFactory({
        is_passenger: true,
        is_driver: false,
      })
    );

    const passengerId = signupRes.data.account_id;
    const input = makeRideFactory({ passenger_id: passengerId });

    await makeRequest<{ ride_id: string }>('/rides', input);
    const requestRideRes = await makeRequest<{ message: string }>('/rides', input);

    expect(requestRideRes.status).toBe(422);
    expect(requestRideRes.data.message).toBe('account already have a ride in progress');
  });
});
