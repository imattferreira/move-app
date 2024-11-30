import Ride from "../../domain/entities/ride";
import RidesRepositoryInMemory from "../../infra/repositories/in-memory/rides-repository";
import StartRide from "./start-ride";

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
      rideId: ride.id,
    };

    await startRide.execute(input);

    const updatedRide = await ridesRepository.findByRideId(ride.id);

    expect(updatedRide?.status).toBe('in_progress');
  });

  it('should not be able to start a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const startRide = new StartRide(ridesRepository);

    const input = {
      rideId: Math.random().toString(),
    };

    await expect(startRide.execute(input)).rejects.toThrow('ride not found');
  });

  it('should not be able to start a already started ride', async () => {
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
      rideId: Math.random().toString(),
    };

    await startRide.execute(input);

    await expect(startRide.execute(input)).rejects.toThrow('ride already started');
  });
});
