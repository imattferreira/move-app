import NotFoundException from '~/application/exceptions/not-found-exception';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';
import StartRide from './start-ride';

describe('StartRide', () => {
  it('should be able to start a ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const startRide = new StartRide(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
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
});
