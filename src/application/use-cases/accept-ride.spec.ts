import Account from "../../domain/entities/account";
import Ride from "../../domain/entities/ride";
import AccountsRepositoryInMemory from "../../infra/repositories/in-memory/accounts-repository";
import RidesRepositoryInMemory from "../../infra/repositories/in-memory/rides-repository";
import AcceptRide from "./accept-ride";

describe('AcceptRide', () => {
  it('should be able a driver accept a ride', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      null,
      false,
      true,
      '1233456'
    );
    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.id,
      rideId: ride.id
    };

    await acceptRide.execute(input);

    const updatedRide = await ridesRepository.findByRideId(ride.id);

    expect(updatedRide?.driverId).toBe(driver.id);
    expect(updatedRide?.status).toBe('accepted');
  });

  it('should not accept a ride when driver don\'t exists', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    await ridesRepository.save(ride);

    const input = {
      driverId: Math.random().toString(),
      rideId: ride.id
    };

    await acceptRide.execute(input);
    await ridesRepository.findByRideId(ride.id);

    await expect(
      ridesRepository.findByRideId(ride.id)
    ).rejects.toThrow('driver not found');
  });

  it('should not be able a passenger accept a ride', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      null,
      true,
      false,
      '1233456'
    );
    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.id,
      rideId: ride.id
    };

    await acceptRide.execute(input);
    await ridesRepository.findByRideId(ride.id);

    await expect(
      ridesRepository.findByRideId(ride.id)
    ).rejects.toThrow('user needs to be a driver to accept a ride');
  });

  it('should not be able a driver accept a ride that already accepted', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      null,
      false,
      true,
      '1233456'
    );
    const ride = Ride.create(
      Math.random().toString(),
      12312312,
      12312312,
      52423423,
      1245245
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.id,
      rideId: ride.id
    };

    await acceptRide.execute(input);
    await ridesRepository.findByRideId(ride.id);

    await expect(ridesRepository.findByRideId(ride.id)).rejects.toThrow('ride already accepted');
  });
});
