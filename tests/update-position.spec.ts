import { makeAccountFactory, makePositionFactory, makeRideFactory } from './factories/entities';
import type { Object } from '~/utils/types';
import crypto from 'node:crypto';
import { makeRequest } from './utils';

describe('POST /positions', () => {
  it('should be able to update the position of a ride', async () => {
    const passenger = makeAccountFactory({ is_passenger: true });
    const driver = makeAccountFactory({ is_driver: true });

    const passengerSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/v1/signup',
      passenger
    );
    const driverSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/v1/signup',
      driver
    );

    const passengerId = passengerSignupRes.data?.account_id;
    const driverId = driverSignupRes.data?.account_id;

    const ride = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>(
      'POST',
      '/v1/rides',
      ride
    );

    const rideId = requestRideRes.data?.ride_id;

    await makeRequest('POST', `/v1/rides/${rideId}/${driverId}`);
    await makeRequest('PATCH', `/v1/rides/${rideId}`);

    const position = makePositionFactory({ ride_id: rideId });

    const updatePositionRes = await makeRequest(
      'POST',
      '/v1/positions',
      position
    );

    expect(updatePositionRes.status).toBe(200);

    // TODO: create an endpoint to get position info and check it
  });

  it(
    'should not be able to update the position of a non-existing ride',
    async () => {
      const rideId = crypto.randomUUID();

      const position = makePositionFactory({ ride_id: rideId });

      const updatePositionRes = await makeRequest<Object>(
        'POST',
        '/v1/positions',
        position
      );

      expect(updatePositionRes.status).toBe(404);
      expect(updatePositionRes.data?.message).toBe('ride not found');
    });
});
