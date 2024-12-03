import ConflictException from '~/application/exceptions/conflict-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepositoryInMemory from '~/infra/repositories/in-memory/positions-repository';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';
import UpdatePosition from './update-position';

describe('UpdatePosition', () => {
  it('should be able update the position of a ride', async () => {
    const positionsRepository = new PositionsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const updatePosition = new UpdatePosition(
      positionsRepository,
      ridesRepository
    );

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    ride.attachDriver(Math.random().toString());
    ride.start();

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.getId(),
      lat: Math.random() * 100,
      long: Math.random() * 100
    };

    await updatePosition.execute(input);

    const positions = await positionsRepository.findAllById(ride.getId());

    expect(positions).toHaveLength(1);
    expect(positions[0].id).toBeDefined();
    expect(positions[0].rideId).toBe(input.rideId);
    expect(positions[0].lat).toBe(input.lat);
    expect(positions[0].long).toBe(input.long);
  });

  it('should not update the position of a non-existing ride', async () => {
    const positionsRepository = new PositionsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const updatePosition = new UpdatePosition(
      positionsRepository,
      ridesRepository
    );

    const input = {
      rideId: Math.random().toString(),
      lat: Math.random() * 100,
      long: Math.random() * 100
    };

    await expect(
      () => updatePosition.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it(
    'should not update the position of a ride that aren\'t in progress',
    async () => {
      const positionsRepository = new PositionsRepositoryInMemory();
      const ridesRepository = new RidesRepositoryInMemory();
      const updatePosition = new UpdatePosition(
        positionsRepository,
        ridesRepository
      );

      const ride = Ride.create(
        Math.random().toString(),
        -27.584905257808835,
        -48.545022195325124,
        -27.496887588317275,
        -48.522234807851476
      );

      await ridesRepository.save(ride);

      const input = {
        rideId: ride.getId(),
        lat: Math.random() * 100,
        long: Math.random() * 100
      };

      await expect(
        () => updatePosition.execute(input)
      ).rejects.toThrow(new ConflictException('ride is not in progress'));
    });
});
