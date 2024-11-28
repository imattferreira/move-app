import Ride from "../entities/ride";
import type AccountsRepository from "../repositories/accounts-repository";
import type RidesRepository from "../repositories/rides-repository";

interface Input {
  passengerId: string;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
}

interface Output {
  rideId: string;
}

class RequestRide {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly ridesRepository: RidesRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountsRepository.findByAccountId(
      input.passengerId
    );

    if (!passenger) {
      throw new Error('account not found');
    }

    if (!passenger.isPassenger) {
      throw new Error('account needs to be a passenger');
    }

    const lastRide = await this.ridesRepository.findLastRideOfPassenger(
      passenger.id
    );

    if (lastRide && lastRide.status !== 'completed') {
      throw new Error('account already have a ride in progress');
    }

    const ride = Ride.create(
      input.passengerId,
      0,
      0,
      input.from_lat,
      input.from_long,
      input.to_lat,
      input.to_long
    );

    await this.ridesRepository.save(ride);

    return { rideId: ride.id };
  }
}

export default RequestRide;
