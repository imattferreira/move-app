import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';
import StartRide from './start-ride';
import NotFoundException from '~/application/exceptions/not-found-exception';
import ConflictException from '~/application/exceptions/conflict-exception';

describe('StartRide', () => {
  it('should be able to start a ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const startRide = new StartRide(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    ride.attachDriver(Math.random().toString());

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.id
    };

    await startRide.execute(input);

    const updatedRide = await ridesRepository.findById(ride.id);

    expect(updatedRide?.status).toBe('in_progress');
  });

  it('should not start a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const startRide = new StartRide(ridesRepository);

    const input = {
      rideId: Math.random().toString()
    };

    await expect(
      () => startRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it('should not start a already started ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const startRide = new StartRide(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    ride.attachDriver(Math.random().toString());

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.id
    };

    await startRide.execute(input);

    await expect(
      () => startRide.execute(input)
    ).rejects.toThrow(new ConflictException('ride already started'));
  });
});
