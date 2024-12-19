import '~/main';
import type AccountsGateway from '~/application/gateways/accounts-gateway';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import Identifier from '~/domain/value-objects/identifier';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Registry from '~/infra/registry/registry';
import RequestRide from './request-ride';
import type RidesRepository from '~/application/repositories/rides-repository';

describe('RequestRide', () => {
  it('should be able request a new ride', async () => {
    const registry = Registry.getInstance();
    const ridesRepository = registry.inject<RidesRepository>('RidesRepository');
    const accountsGateway = registry.inject<AccountsGateway>('AccountsGateway');
    const requestRide = new RequestRide();

    const passenger = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      carPlate: 'ABC1234',
      isPassenger: true,
      isDriver: false,
      password: '1233456789'
    };

    const signupOutput = await accountsGateway.signup(passenger);

    const passengerId = signupOutput.accountId;
    const input = {
      passengerId,
      fromLat: -27.584905257808835,
      fromLong: -48.545022195325124,
      toLat: -27.496887588317275,
      toLong: -48.522234807851476
    };

    const output = await requestRide.execute(input);
    const ride = await ridesRepository.findById(output.rideId);

    expect(output.rideId).toBeDefined();
    expect(ride?.getPassengerId()).toBe(passengerId);
    expect(ride?.getStatus()).toBe('requested');
    expect(ride?.getFare()).toBe(0);
    expect(ride?.getDistance()).toBe(0);
    expect(ride?.getFrom().getLat()).toBe(input.fromLat);
    expect(ride?.getFrom().getLong()).toBe(input.fromLong);
    expect(ride?.getTo().getLat()).toBe(input.toLat);
    expect(ride?.getTo().getLong()).toBe(input.toLong);
    expect(ride?.getDate()).toBeInstanceOf(Date);
  });

  it('should not request a new ride when passenger not exists', async () => {
    const requestRide = new RequestRide();

    const input = {
      passengerId: Identifier.create().getValue(),
      fromLat: -27.584905257808835,
      fromLong: -48.545022195325124,
      toLat: -27.496887588317275,
      toLong: -48.522234807851476
    };

    await expect(
      () => requestRide.execute(input)
    ).rejects.toThrow(new NotFoundException('account not found'));
  });

  it(
    'should not able request a new ride when passenger is a driver',
    async () => {
      const registry = Registry.getInstance();
      const accountsGateway = registry.inject<AccountsGateway>(
        'AccountsGateway'
      );
      const requestRide = new RequestRide();

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
        passengerId: signupOutput.accountId,
        fromLat: 0,
        fromLong: 0,
        toLat: 0,
        toLong: 0
      };

      await expect(
        () => requestRide.execute(input)
      ).rejects.toThrow(
        new ForbiddenException('account needs to be of a passenger')
      );
    });

  it(
    'should not request a new ride when passenger already have a ride in progress',
    async () => {
      const registry = Registry.getInstance();
      const accountsGateway = registry.inject<AccountsGateway>(
        'AccountsGateway'
      );
      const requestRide = new RequestRide();

      const passenger = {
        name: 'John Doe',
        email: `john${Math.random()}@doe.com`,
        cpf: '475.646.550-11',
        carPlate: 'ABC1234',
        isPassenger: true,
        isDriver: false,
        password: '1233456789'
      };

      const signupOutput = await accountsGateway.signup(passenger);

      const input = {
        passengerId: signupOutput.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
      };

      await requestRide.execute(input);

      await expect(
        () => requestRide.execute(input)
      ).rejects.toThrow(
        new ConflictException('account already have a ride in progress')
      );
    });
});
