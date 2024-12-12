import ConflictException from '~/application/exceptions/conflict-exception';
import Position from './position';
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

    expect(ride.getId()).toBeDefined();
    expect(ride.getPassengerId()).toBe(input.passengerId);
    expect(ride.getDriverId()).toBeNull();
    expect(ride.getStatus()).toBe('requested');
    expect(ride.getFare()).toBe(0);
    expect(ride.getDistance()).toBe(0);
    expect(ride.getFrom().getLat()).toBe(input.fromLat);
    expect(ride.getFrom().getLong()).toBe(input.fromLong);
    expect(ride.getTo().getLat()).toBe(input.toLat);
    expect(ride.getTo().getLong()).toBe(input.toLong);
    expect(ride.getDate()).toBeInstanceOf(Date);
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

    ride.accept(driverId);

    expect(ride.getDriverId()).toBe(driverId);
    expect(ride.getStatus()).toBe('accepted');
  });

  it('should be able to start the ride', () => {
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.accept(Math.random().toString());
    ride.start();

    expect(ride.getStatus()).toBe('in_progress');
  });

  it('should be able to finish the ride', () => {
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    const positions = [
      Position.create(
        Math.random().toString(),
        -27.584905257808835,
        -48.545022195325124
      ),
      Position.create(
        Math.random().toString(),
        -27.496887588317275,
        -48.522234807851476
      )
    ];

    ride.accept(Math.random().toString());
    ride.start();
    ride.finish(positions);

    expect(ride.getStatus()).toBe('completed');
    expect(ride.getDistance()).toBe(10);
    expect(ride.getFare()).toBe(21);
  });

  it('should not accept a ride when already active', () => {
    const driverId = Math.random().toString();

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    ride.accept(driverId);

    expect(
      () => ride.accept(driverId)
    ).toThrow(new ConflictException('ride already accepted'));
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

    ride.accept(driverId);
    ride.start();

    expect(
      () => ride.start()
    ).toThrow(new ConflictException('ride already started'));
  });

  it('should not finish the ride when is not active', () => {
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    expect(
      () => ride.finish([])
    ).toThrow(new ConflictException('ride not started yet'));
  });
});
