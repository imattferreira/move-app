import ConflictException from '~/application/exceptions/conflict-exception';
import Ride from './ride';

describe('Ride', () => {
  it('should be able to create a ride', () => {
    const input = {
      passengerId: Math.random().toString(),
      fromLat: -27.584905257808835,
      fromLong: -48.545022195325124,
      toLat: -27.496887588317275,
      toLong: -48.522234807851476
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
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.attachDriver(driverId);

    expect(ride.driverId).toBe(driverId);
    expect(ride.status).toBe('accepted');
  });

  it('should be able to start the ride', () => {
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.attachDriver(Math.random().toString());
    ride.start();

    expect(ride.status).toBe('in_progress');
  });

  it('should not start the ride when already active', () => {
    const driverId = Math.random().toString();

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.attachDriver(driverId);
    ride.start();

    expect(
      () => ride.start()
    ).toThrow(new ConflictException('ride already started'));
  });
});
