import crypto from 'node:crypto';
import type { Object } from '~/utils/types';
import { makeAccountFactory, makeRideFactory } from './factories/entities';
import { makeRequest } from './utils';

describe('PATCH /rides/:rideId', () => {
  it('should be able to start a ride', async () => {
    const passenger = makeAccountFactory({ is_passenger: true });
    const driver = makeAccountFactory({ is_driver: true });

    const passengerSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/signup',
      passenger
    );
    const driverSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/signup',
      driver
    );

    const passengerId = passengerSignupRes.data?.account_id;
    const driverId = driverSignupRes.data?.account_id;

    const ride = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>(
      'POST',
      '/rides',
      ride
    );

    const rideId = requestRideRes.data?.ride_id;

    await makeRequest(
      'POST',
      `/rides/${rideId}/${driverId}`
    );
    const startRideRes = await makeRequest(
      'PATCH',
      `/rides/${rideId}`
    );

    expect(startRideRes.status).toBe(200);

    const getRideRes = await makeRequest<Object>('GET', `/rides/${rideId}`);

    expect(getRideRes.data?.status).toBe('in_progress');
  });

  it('should not be able to start a non-existing ride', async () => {
    const rideId = crypto.randomUUID();

    const startRideRes = await makeRequest<Object>('PATCH', `/rides/${rideId}`);

    expect(startRideRes.status).toBe(404);
    expect(startRideRes.data?.message).toBe('ride not found');
  });
});
