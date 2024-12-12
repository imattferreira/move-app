import { makeAccountFactory, makeRideFactory } from './factories/entities';
import type { Object } from '~/utils/types';
import { makeRequest } from './utils';

describe('POST /rides', () => {
  it('should be able request a new ride', async () => {
    const signupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/v1/signup',
      makeAccountFactory({
        is_passenger: true,
        is_driver: false
      })
    );

    const passengerId = signupRes.data?.account_id;
    const input = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>(
      'POST',
      '/v1/rides',
      input
    );

    const rideId = requestRideRes.data?.ride_id;

    expect(requestRideRes.status).toBe(200);
    expect(rideId).toBeDefined();

    const registeredRideRes = await makeRequest<Record<string, unknown>>(
      'GET',
      `/v1/rides/${rideId}`
    );

    expect(registeredRideRes.data?.id).toBe(rideId);
    expect(registeredRideRes.data?.passenger_id).toBe(passengerId);
    expect(registeredRideRes.data?.status).toBe('requested');
    expect(registeredRideRes.data?.fare).toBe(0);
    expect(registeredRideRes.data?.distance).toBe(0);
    expect(registeredRideRes.data?.from_lat).toBe(input.from_lat);
    expect(registeredRideRes.data?.from_long).toBe(input.from_long);
    expect(registeredRideRes.data?.to_lat).toBe(input.to_lat);
    expect(registeredRideRes.data?.to_long).toBe(input.to_long);
    expect(registeredRideRes.data?.date).toBeDefined();
  });

  it(
    'should not request a new ride when passenger already have a ride in progress',
    async () => {
      const signupRes = await makeRequest<{ account_id: string }>(
        'POST',
        '/v1/signup',
        makeAccountFactory({
          is_passenger: true,
          is_driver: false
        })
      );

      const passengerId = signupRes.data?.account_id;
      const input = makeRideFactory({ passenger_id: passengerId });

      await makeRequest<{ ride_id: string }>('POST', '/v1/rides', input);
      const requestRideRes = await makeRequest<Object>(
        'POST',
        '/v1/rides',
        input
      );

      expect(requestRideRes.status).toBe(409);
      expect(
        requestRideRes.data?.message
      ).toBe('account already have a ride in progress');
    });
});
