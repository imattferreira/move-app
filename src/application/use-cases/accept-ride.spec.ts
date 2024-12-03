import AcceptRide from './accept-ride';
import Account from '~/domain/entities/account';
import AccountsRepositoryInMemory from '~/infra/repositories/in-memory/accounts-repository';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';

describe('AcceptRide', () => {
  it('should be able a driver accept a ride', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '1233456'
    );
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.getId(),
      rideId: ride.getId()
    };

    await acceptRide.execute(input);

    const updatedRide = await ridesRepository.findById(ride.getId());

    expect(updatedRide?.getDriverId()).toBe(driver.getId());
    expect(updatedRide?.status).toBe('accepted');
  });

  it('should not accept a ride when driver don\'t exists', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await ridesRepository.save(ride);

    const input = {
      driverId: Math.random().toString(),
      rideId: ride.getId()
    };

    await expect(
      () => acceptRide.execute(input)
    ).rejects.toThrow(new NotFoundException('driver not found'));
  });

  it('should not accept a ride when ride don\'t exists', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '1233456'
    );

    await accountsRepository.save(driver);

    const input = {
      driverId: driver.getId(),
      rideId: Math.random().toString()
    };

    await expect(
      () => acceptRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it('should not a passenger accept a ride', async () => {
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
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.getId(),
      rideId: ride.getId()
    };

    await expect(() => acceptRide.execute(input)).rejects.toThrow(
      new ForbiddenException('user needs to be a driver to accept a ride')
    );
  });

  it('should not a driver accept a ride that already accepted', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '1233456'
    );
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: driver.getId(),
      rideId: ride.getId()
    };

    await acceptRide.execute(input);

    await expect(() => acceptRide.execute(input)).rejects.toThrow(
      new ConflictException('ride already accepted by another driver')
    );
  });

  it('should not a driver accept more than 1 ride per time', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const acceptRide = new AcceptRide(accountsRepository, ridesRepository);

    const driver = Account.create(
      'John Doe',
      'john@doe.com',
      '475.646.550-11',
      'ABC1234',
      false,
      true,
      '1233456'
    );
    const ride1 = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    const ride2 = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await accountsRepository.save(driver);
    await ridesRepository.save(ride1);
    await ridesRepository.save(ride2);
    await acceptRide.execute({
      driverId: driver.getId(),
      rideId: ride1.getId()
    });

    await expect(
      () => acceptRide.execute({
        driverId: driver.getId(),
        rideId: ride2.getId()
      })
    ).rejects.toThrow(
      new ConflictException('driver already have a ride active')
    );
  });
});
