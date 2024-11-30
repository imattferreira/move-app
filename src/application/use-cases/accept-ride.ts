import type AccountsRepository from "../repositories/accounts-repository";
import type RidesRepository from "../repositories/rides-repository";

interface Input {
  driverId: string;
  rideId: string;
}

class AcceptRide {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const driver = await this.accountsRepository.findByAccountId(input.driverId);

    if (!driver) {
      throw new Error('driver not found');
    }

    if (!driver.isDriver) {
      throw new Error('user needs to be a driver to accept a ride');
    }

    const ride = await this.ridesRepository.findByRideId(input.rideId);

    if (!ride) {
      throw new Error('ride not found');
    }

    ride.attachDriver(driver.id);

    await this.ridesRepository.update(ride);
  }
}

export default AcceptRide;
