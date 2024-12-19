import { makeAccountFactory, makeRideFactory } from './factories/entities';
import type { Object } from '~/utils/types';
import crypto from 'node:crypto';
import { makeRequest } from './utils';

describe('GET /rides/:rideId', () => {
  it('should be able to get info about a existing ride', async () => {
    const passenger = makeAccountFactory({ is_passenger: true });

    const passengerSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/v1/signup',
      passenger
    );

    const passengerId = passengerSignupRes.data?.account_id;

    const ride = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>(
      'POST',
      '/v1/rides',
      ride
    );

    const rideId = requestRideRes.data?.ride_id;

    const getRideRes = await makeRequest<Object>('GET', `/v1/rides/${rideId}`);

    expect(getRideRes.status).toBe(200);
    expect(getRideRes.data?.id).toBe(rideId);
    expect(getRideRes.data?.passenger_id).toBe(passengerId);
    expect(getRideRes.data?.status).toBe('requested');
    expect(getRideRes.data?.fare).toBe(0);
    expect(getRideRes.data?.distance).toBe(0);
    expect(getRideRes.data?.from_lat).toBe(ride.from_lat);
    expect(getRideRes.data?.from_long).toBe(ride.from_long);
    expect(getRideRes.data?.to_lat).toBe(ride.to_lat);
    expect(getRideRes.data?.to_long).toBe(ride.to_long);
    expect(getRideRes.data?.date).toBeDefined();
  });

  it('should not be able to get info about non-existing a ride', async () => {
    const rideId = crypto.randomUUID();

    const getRideRes = await makeRequest<Object>('GET', `/v1/rides/${rideId}`);

    expect(getRideRes.status).toBe(404);
    expect(getRideRes.data?.message).toBe('ride not found');
  });
});
