import Ride from '~/domain/entities/ride';
import type AccountsRepository from '../repositories/accounts-repository';
import type RidesRepository from '../repositories/rides-repository';

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
      throw new Error('account not found');
    }

    if (!passenger.isPassenger) {
      throw new Error('account needs to be of a passenger');
    }

    const hasActiveRide = await this.ridesRepository.hasActiveRideOfPassenger(
      passenger.id
    );

    if (hasActiveRide) {
      throw new Error('account already have a ride in progress');
    }

    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );

    await this.ridesRepository.save(ride);

    return { rideId: ride.id };
  }
}

export default RequestRide;
