import '~/main';
import ConflictException from '~/application/exceptions/conflict-exception';
import FinishRide from './finish-ride';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Position from '~/domain/entities/position';
import type PositionsRepository from '../repositories/positions-repository';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import type RidesRepository from '../repositories/rides-repository';

describe('FinishRide', () => {
  it('should be able finish a ride', async () => {
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const positionsRepository = registry.inject<PositionsRepository>(
      'PositionsRepository'
    );
    const finishRide = new FinishRide();

    const ride = Ride.create(
      Identifier.create().getValue(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    ride.accept(Identifier.create().getValue());
    ride.start();

    await ridesRepository.save(ride);
    await positionsRepository.save(Position.create(
      ride.getId(),
      -27.584905257808835,
      -48.545022195325124
    ));
    await positionsRepository.save(Position.create(
      ride.getId(),
      -27.496887588317275,
      -48.522234807851476
    ));
    await finishRide.execute({ rideId: ride.getId() });

    const updatedRide = await ridesRepository.findById(ride.getId());

    expect(updatedRide?.getStatus()).toBe('completed');
    expect(updatedRide?.getDistance()).toBe(10);
    expect(updatedRide?.getFare()).toBe(21.0);
  });

  it('should not finish a non-existing ride', async () => {
    const finishRide = new FinishRide();

    await expect(
      () => finishRide.execute({ rideId: Identifier.create().getValue() })
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it('should not finish a non started ride', async () => {
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const finishRide = new FinishRide();

    const ride = Ride.create(
      Identifier.create().getValue(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.accept(Identifier.create().getValue());

    await ridesRepository.save(ride);

    await expect(
      () => finishRide.execute({ rideId: ride.getId() })
    ).rejects.toThrow(new ConflictException('ride not started yet'));
  });
});
