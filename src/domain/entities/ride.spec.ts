import ConflictException from '~/application/exceptions/conflict-exception';
import Ride from './ride';

describe('Ride', () => {
  it('should be able to create a ride', () => {
    const input = {
      passengerId: Math.random().toString(),
      fromLat: 10,
      fromLong: 20,
      toLat: 30,
      toLong: 40
    };

    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );

    expect(ride.id).toBeDefined();
    expect(ride.passengerId).toBe(input.passengerId);
    expect(ride.driverId).toBeNull();
    expect(ride.status).toBe('requested');
    expect(ride.fare).toBe(0);
    expect(ride.distance).toBe(0);
    expect(ride.fromLat).toBe(input.fromLat);
    expect(ride.fromLong).toBe(input.fromLong);
    expect(ride.toLat).toBe(input.toLat);
    expect(ride.toLong).toBe(input.toLong);
    expect(ride.date).toBeInstanceOf(Date);
  });

  it('should be able to attach a driver to the ride', () => {
    const driverId = Math.random().toString();

    const ride = Ride.create(
      Math.random().toString(),
      10,
      20,
      30,
      40
    );

    ride.attachDriver(driverId);

    expect(ride.driverId).toBe(driverId);
    expect(ride.status).toBe('accepted');
  });

  it('should be able to start the ride', () => {
    const ride = Ride.create(
      Math.random().toString(),
      10,
      20,
      30,
      40
    );

    ride.attachDriver(Math.random().toString());
    ride.start();

    expect(ride.status).toBe('in_progress');
  });

  it('should not start the ride when already active', () => {
    const driverId = Math.random().toString();

    const ride = Ride.create(
      Math.random().toString(),
      10,
      20,
      30,
      40
    );

    ride.attachDriver(driverId);
    ride.start();

    expect(
      () => ride.start()
    ).toThrow(new ConflictException('ride already started'));
  });
});
