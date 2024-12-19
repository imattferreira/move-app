import '~/main';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import type RidesRepository from '~/application/repositories/rides-repository';
import StartRide from './start-ride';

describe('StartRide', () => {
  it('should be able to start a ride', async () => {
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const startRide = new StartRide();

    const ride = Ride.create(
      Identifier.create().getValue(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.accept(Identifier.create().getValue());

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.getId()
    };

    await startRide.execute(input);

    const updatedRide = await ridesRepository.findById(ride.getId());

    expect(updatedRide?.getStatus()).toBe('in_progress');
  });

  it('should not start a non-existing ride', async () => {
    const startRide = new StartRide();

    const input = {
      rideId: Identifier.create().getValue()
    };

    await expect(
      () => startRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
