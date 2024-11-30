import Account from '../../domain/entities/account';
import AccountsRepositoryInMemory from '../../infra/repositories/in-memory/accounts-repository';
import RidesRepositoryInMemory from '../../infra/repositories/in-memory/rides-repository';
import RequestRide from './request-ride';

describe('RequestRide', () => {
  it('should be able request a new ride', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const requestRide = new RequestRide(accountsRepository, ridesRepository);

    const passenger = Account.create(
      'John Doe',
      'john@doe.com',
      '639.219.000-77',
      'ABC3122',
      true,
      false,
      '123123123'
    );

    await accountsRepository.save(passenger);

    const input = {
      passengerId: passenger.id,
      fromLat: -27.584905257808835,
  		fromLong: -48.545022195325124,
  		toLat: -27.496887588317275,
  		toLong: -48.522234807851476
    };

    const output = await requestRide.execute(input);
    const ride = await ridesRepository.findByRideId(output.rideId);

    expect(output.rideId).toBeDefined();
    expect(ride?.passengerId).toBe(passenger.id);
    expect(ride?.status).toBe('requested');
    expect(ride?.fare).toBe(0);
    expect(ride?.distance).toBe(0);
    expect(ride?.fromLat).toBe(input.fromLat);
    expect(ride?.fromLong).toBe(input.fromLong);
    expect(ride?.toLat).toBe(input.toLat);
    expect(ride?.toLong).toBe(input.toLong);
    expect(ride?.date).toBeInstanceOf(Date);
  });

  it('should not request a new ride when passenger not exists', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const requestRide = new RequestRide(accountsRepository, ridesRepository);

    const passenger = Account.create(
      'John Doe',
      'john@doe.com',
      '639.219.000-77',
      'ABC3122',
      false,
      true,
      '123123123'
    );

    await accountsRepository.save(passenger);

    const input = {
      passengerId: Math.random().toString(),
      fromLat: -27.584905257808835,
  		fromLong: -48.545022195325124,
  		toLat: -27.496887588317275,
  		toLong: -48.522234807851476
    };

    await expect(
      requestRide.execute(input)
    ).rejects.toThrow('account not found');
  });

  it('should not able request a new ride when passenger is a driver', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const requestRide = new RequestRide(accountsRepository, ridesRepository);

    const passenger = Account.create(
      'John Doe',
      'john@doe.com',
      '639.219.000-77',
      'ABC3122',
      false,
      true,
      '123123123'
    );

    await accountsRepository.save(passenger);

    const input = {
      passengerId: passenger.id,
      fromLat: 0,
      fromLong: 0,
      toLat: 0,
      toLong: 0
    };

    await expect(
      requestRide.execute(input)
    ).rejects.toThrow('account needs to be of a passenger');
  });

  it('should not request a new ride when passenger already have a ride in progress', async () => {
    const accountsRepository = new AccountsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const requestRide = new RequestRide(accountsRepository, ridesRepository);

    const passenger = Account.create(
      'John Doe',
      'john@doe.com',
      '639.219.000-77',
      'ABC3122',
      true,
      false,
      '123123123'
    );

    await accountsRepository.save(passenger);

    const input = {
      passengerId: passenger.id,
      fromLat: -27.584905257808835,
  		fromLong: -48.545022195325124,
  		toLat: -27.496887588317275,
  		toLong: -48.522234807851476
    };

    await requestRide.execute(input);

    await expect(
      requestRide.execute(input)
    ).rejects.toThrow('account already have a ride in progress');
  });
});
