import { makeAccountFactory, makeRideFactory } from './factories/entities';
import type { Object } from '~/utils/types';
import crypto from 'node:crypto';
import { makeRequest } from './utils';

describe('POST /rides/:rideId/:driverId', () => {
  it('should be able to accept a ride', async () => {
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

    const acceptRideRes = await makeRequest(
      'POST',
      `/rides/${rideId}/${driverId}`
    );

    expect(acceptRideRes.status).toBe(200);

    const getRideRes = await makeRequest<Object>('GET', `/rides/${rideId}`);

    expect(getRideRes.data?.driver_id).toBe(driverId);
    expect(getRideRes.data?.status).toBe('accepted');
  });

  it('should not be able accept a ride when ride not exists', async () => {
    const driver = makeAccountFactory({ is_driver: true });

    const driverSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/signup',
      driver
    );

    const driverId = driverSignupRes.data?.account_id;

    const rideId = crypto.randomUUID();

    const acceptRideRes = await makeRequest<Object>(
      'POST',
      `/rides/${rideId}/${driverId}`
    );

    expect(acceptRideRes.status).toBe(404);
    expect(acceptRideRes.data?.message).toBe('ride not found');
  });

  it('should not be able accept a ride when driver not exists', async () => {
    const passenger = makeAccountFactory({ is_passenger: true });

    const passengerSignupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/signup',
      passenger
    );

    const passengerId = passengerSignupRes.data?.account_id;
    const driverId = crypto.randomUUID();
    const ride = makeRideFactory({ passenger_id: passengerId });

    const requestRideRes = await makeRequest<{ ride_id: string }>(
      'POST',
      '/rides',
      ride
    );

    const rideId = requestRideRes.data?.ride_id;

    const acceptRideRes = await makeRequest<Object>(
      'POST',
      `/rides/${rideId}/${driverId}`
    );

    expect(acceptRideRes.status).toBe(404);
    expect(acceptRideRes.data?.message).toBe('driver not found');
  });

  it(
    'should not be able to accept a ride when driver already have a active ride',
    async () => {
      const passenger1 = makeAccountFactory({ is_passenger: true });
      const passenger2 = makeAccountFactory({ is_passenger: true });
      const driver = makeAccountFactory({ is_driver: true });

      const passenger1SignupRes = await makeRequest<{ account_id: string }>(
        'POST',
        '/signup',
        passenger1
      );
      const passenger2SignupRes = await makeRequest<{ account_id: string }>(
        'POST',
        '/signup',
        passenger2
      );
      const driverSignupRes = await makeRequest<{ account_id: string }>(
        'POST',
        '/signup',
        driver
      );

      const passenger1Id = passenger1SignupRes.data?.account_id;
      const passenger2Id = passenger2SignupRes.data?.account_id;
      const driverId = driverSignupRes.data?.account_id;

      const ride1 = makeRideFactory({ passenger_id: passenger1Id });
      const ride2 = makeRideFactory({ passenger_id: passenger2Id });

      const requestRide1Res = await makeRequest<{ ride_id: string }>(
        'POST',
        '/rides',
        ride1
      );
      const requestRide2Res = await makeRequest<{ ride_id: string }>(
        'POST',
        '/rides',
        ride2
      );

      const ride1Id = requestRide1Res.data?.ride_id;
      const ride2Id = requestRide2Res.data?.ride_id;

      await makeRequest('POST', `/rides/${ride1Id}/${driverId}`);
      const acceptRideRes = await makeRequest<Object>(
        'POST',
        `/rides/${ride2Id}/${driverId}`
      );

      expect(acceptRideRes.status).toBe(409);
      expect(
        acceptRideRes.data?.message
      ).toBe('driver already have a ride active');
    });
});
