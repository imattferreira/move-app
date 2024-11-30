import Ride from '../entities/ride';
import { RidesRepositoryInMemory } from '../repositories/rides-repository';
import GetRide from './get-ride';

describe('GetRide', () => {
  it('should be able to get info about a existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    await ridesRepository.save(ride);
    const output = await getRide.execute({ rideId: ride.id });

    expect(output.id).toBe(ride.id);
    expect(output.passengerId).toBe(ride.passengerId);
    expect(output.driverId).toBe(ride.driverId);
    expect(output.status).toBe(ride.status);
    expect(output.fare).toBe(ride.fare);
    expect(output.distance).toBe(ride.distance);
    expect(output.fromLat).toBe(ride.fromLat);
    expect(output.fromLong).toBe(ride.fromLong);
    expect(output.toLat).toBe(ride.toLat);
    expect(output.toLong).toBe(ride.toLong);
  });

  it('should not be able to get info about a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(ridesRepository);

    const rideId = Math.random().toString();

    await expect(getRide.execute({ rideId })).rejects.toThrow('ride not found');
  });
});
