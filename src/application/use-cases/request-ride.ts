import type AccountsRepository from '~/application/repositories/accounts-repository';
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
    private readonly accountsRepository: AccountsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountsRepository.findById(input.passengerId);

    if (!passenger) {
      throw new NotFoundException('account not found');
    }

    if (!passenger.getIsPassenger()) {
      throw new ForbiddenException('account needs to be of a passenger');
    }

    const hasActiveRide = await this.ridesRepository.hasActiveRideOfPassenger(
      passenger.getId()
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
