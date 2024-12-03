import GetRide from './get-ride';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';

describe('GetRide', () => {
  it('should be able to get info about a existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await ridesRepository.save(ride);
    const output = await getRide.execute({ rideId: ride.getId() });

    expect(output.id).toBe(ride.getId());
    expect(output.passengerId).toBe(ride.getPassengerId());
    expect(output.driverId).toBe(ride.getDriverId());
    expect(output.status).toBe(ride.getStatus());
    expect(output.fare).toBe(ride.getFare());
    expect(output.distance).toBe(ride.getDistance());
    expect(output.fromLat).toBe(ride.getFrom().getLat());
    expect(output.fromLong).toBe(ride.getFrom().getLong());
    expect(output.toLat).toBe(ride.getTo().getLat());
    expect(output.toLong).toBe(ride.getTo().getLong());
  });

  it('should not get info about a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(ridesRepository);

    const rideId = Math.random().toString();

    await expect(
      () => getRide.execute({ rideId })
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
