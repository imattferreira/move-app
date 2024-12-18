import AcceptRide from './accept-ride';
import ConflictException from '~/application/exceptions/conflict-exception';
import { FetchHttpClientAdapter } from '~/infra/http/http-client';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import HttpAccountsGateway from '~/infra/gateways/http-accounts-gateway';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';

describe('AcceptRide', () => {
  it('should be able a driver accept a ride', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

    const driver = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: false,
      isDriver: true,
      password: '1233456789'
    };
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    const signupOutput = await accountsGateway.signup(driver);
    const driverId = signupOutput.accountId;

    await ridesRepository.save(ride);

    const input = {
      driverId,
      rideId: ride.getId()
    };

    await acceptRide.execute(input);

    const updatedRide = await ridesRepository.findById(ride.getId());

    expect(updatedRide?.getDriverId()).toBe(driverId);
    expect(updatedRide?.getStatus()).toBe('accepted');
  });

  it('should not accept a ride when driver don\'t exists', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

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
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

    const driver = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: false,
      isDriver: true,
      password: '1233456789'
    };
    const signupOutput = await accountsGateway.signup(driver);

    const input = {
      driverId: signupOutput.accountId,
      rideId: Math.random().toString()
    };

    await expect(
      () => acceptRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it('should not a passenger accept a ride', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

    const driver = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: true,
      isDriver: false,
      password: '1233456789'
    };
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    const signupOutput = await accountsGateway.signup(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: signupOutput.accountId,
      rideId: ride.getId()
    };

    await expect(() => acceptRide.execute(input)).rejects.toThrow(
      new ForbiddenException('account needs to be of a driver to accept a ride')
    );
  });

  it('should not a driver accept a ride that already accepted', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

    const driver = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: false,
      isDriver: true,
      password: '1233456789'
    };
    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    const signupOutput = await accountsGateway.signup(driver);
    await ridesRepository.save(ride);

    const input = {
      driverId: signupOutput.accountId,
      rideId: ride.getId()
    };

    await acceptRide.execute(input);

    await expect(() => acceptRide.execute(input)).rejects.toThrow(
      new ConflictException('ride already accepted by another driver')
    );
  });

  it('should not a driver accept more than 1 ride per time', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const ridesRepository = new RidesRepositoryInMemory();
    const registry = Registry.getInstance();

    registry.provide('AccountsGateway', accountsGateway);
    registry.provide('RidesRepository', ridesRepository);

    const acceptRide = new AcceptRide();

    const driver = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: false,
      isDriver: true,
      password: '1233456789'
    };
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

    const signupOutput = await accountsGateway.signup(driver);
    const driverId = signupOutput.accountId;

    await ridesRepository.save(ride1);
    await ridesRepository.save(ride2);
    await acceptRide.execute({
      driverId,
      rideId: ride1.getId()
    });

    await expect(
      () => acceptRide.execute({
        driverId,
        rideId: ride2.getId()
      })
    ).rejects.toThrow(
      new ConflictException('driver already have an active ride')
    );
  });
});
