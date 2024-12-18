import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';
import StartRide from './start-ride';

describe('StartRide', () => {
  it('should be able to start a ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('RidesRepository', ridesRepository);

    const startRide = new StartRide();

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.accept(Math.random().toString());

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.getId()
    };

    await startRide.execute(input);

    const updatedRide = await ridesRepository.findById(ride.getId());

    expect(updatedRide?.getStatus()).toBe('in_progress');
  });

  it('should not start a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('RidesRepository', ridesRepository);

    const startRide = new StartRide();

    const input = {
      rideId: Math.random().toString()
    };

    await expect(
      () => startRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
