import { FetchHttpClientAdapter } from '~/infra/http/http-client';
import GetRide from './get-ride';
import HttpAccountsGateway from '~/infra/gateways/http-accounts-gateway';
import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepositoryInMemory from '~/infra/repositories/in-memory/positions-repository';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';

describe('GetRide', () => {
  it('should be able to get info about a existing ride', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const positionsRepository = new PositionsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(
      accountsGateway,
      positionsRepository,
      ridesRepository
    );

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
    const ride = Ride.create(
      signupOutput.accountId,
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
    const httpClient = new FetchHttpClientAdapter();
    const accountsGateway = new HttpAccountsGateway(httpClient);
    const positionsRepository = new PositionsRepositoryInMemory();
    const ridesRepository = new RidesRepositoryInMemory();
    const getRide = new GetRide(
      accountsGateway,
      positionsRepository,
      ridesRepository
    );

    const rideId = Math.random().toString();

    await expect(
      () => getRide.execute({ rideId })
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
