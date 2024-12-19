import '~/main';
import AcceptRide from './accept-ride';
import type AccountsGateway from '~/application/gateways/accounts-gateway';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';
import Ride from '~/domain/entities/ride';
import type RidesRepository from '~/application/repositories/rides-repository';

describe('AcceptRide', () => {
  it('should be able a driver accept a ride', async () => {
    const registry = Registry.getInstance();
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
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
      Identifier.create().getValue(),
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
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const acceptRide = new AcceptRide();

    const ride = Ride.create(
      Identifier.create().getValue(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );

    await ridesRepository.save(ride);

    const input = {
      driverId: Identifier.create().getValue(),
      rideId: ride.getId()
    };

    await expect(
      () => acceptRide.execute(input)
    ).rejects.toThrow(new NotFoundException('driver not found'));
  });

  it('should not accept a ride when ride don\'t exists', async () => {
    const registry = Registry.getInstance();
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
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
      rideId: Identifier.create().getValue()
    };

    await expect(
      () => acceptRide.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });

  it('should not a passenger accept a ride', async () => {
    const registry = Registry.getInstance();
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
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
      Identifier.create().getValue(),
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
    const registry = Registry.getInstance();
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
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
      Identifier.create().getValue(),
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
    const registry = Registry.getInstance();
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
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
      Identifier.create().getValue(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    const ride2 = Ride.create(
      Identifier.create().getValue(),
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
