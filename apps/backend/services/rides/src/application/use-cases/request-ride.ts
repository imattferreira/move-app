import type AccountsGateway from '../gateways/accounts-gateway';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import Ride from '~/domain/entities/ride';
import type RidesRepository from '~/application/repositories/rides-repository';

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};

class RequestRide {
  constructor(
    private readonly accountsGateway: AccountsGateway,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountsGateway.getById(input.passengerId);

    if (!passenger) {
      throw new NotFoundException('account not found');
    }

    if (!passenger.isPassenger) {
      throw new ForbiddenException('account needs to be of a passenger');
    }

    const hasActiveRide = await this.ridesRepository.hasActiveRideOfPassenger(
      passenger.id
    );

    if (hasActiveRide) {
      throw new ConflictException('account already have a ride in progress');
    }

    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );

    await this.ridesRepository.save(ride);

    return { rideId: ride.getId() };
  }
}

export default RequestRide;
