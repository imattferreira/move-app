import '~/main';
import ConflictException from '~/application/exceptions/conflict-exception';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import type PositionsRepository from '~/application/repositories/positions-repository';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import type RidesRepository from '~/application/repositories/rides-repository';
import UpdatePosition from './update-position';

describe('UpdatePosition', () => {
  it('should be able update the position of a ride', async () => {
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const positionsRepository = registry.inject<PositionsRepository>(
      'PositionsRepository'
    );
    const updatePosition = new UpdatePosition();

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

    const input = {
      rideId: ride.getId(),
      lat: -27.584905257808835,
      long: -48.545022195325124
    };

    await updatePosition.execute(input);

    const positions = await positionsRepository.getAllByRideId(ride.getId());

    expect(positions).toHaveLength(1);
    expect(positions[0].getId()).toBeDefined();
    expect(positions[0].getRideId()).toBe(input.rideId);
    expect(positions[0].getCoord().getLat()).toBe(input.lat);
    expect(positions[0].getCoord().getLong()).toBe(input.long);
  });

  it('should not update the position of a non-existing ride', async () => {
    const updatePosition = new UpdatePosition();

    const input = {
      rideId: Identifier.create().getValue(),
      lat: -27.584905257808835,
      long: -48.545022195325124
    };

    await expect(
      () => updatePosition.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it(
    'should not update the position of a ride that aren\'t in progress',
    async () => {
      const registry = Registry.getInstance();
      const ridesRepository = registry.inject<RidesRepository>(
        'RidesRepository'
      );
      const updatePosition = new UpdatePosition();

      const ride = Ride.create(
        Identifier.create().getValue(),
        -27.584905257808835,
        -48.545022195325124,
        -27.496887588317275,
        -48.522234807851476
      );

      await ridesRepository.save(ride);

      const input = {
        rideId: ride.getId(),
        lat: -27.584905257808835,
        long: -48.545022195325124
      };

      await expect(
        () => updatePosition.execute(input)
      ).rejects.toThrow(new ConflictException('ride is not in progress'));
    });
});
