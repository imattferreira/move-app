import type AccountsRepository from '~/application/repositories/accounts-repository';
import type RidesRepository from '~/application/repositories/rides-repository';

type Input = {
  driverId: string;
  rideId: string;
};

class AcceptRide {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly ridesRepository: RidesRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const driver = await this.accountsRepository.findById(input.driverId);

    if (!driver) {
      throw new Error('driver not found');
    }

    if (!driver.isDriver) {
      throw new Error('user needs to be a driver to accept a ride');
    }

    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new Error('ride not found');
    }

    if (ride.status !== 'requested') {
      throw new Error('ride already accepted');
    }

    const driverHasActiveRide
      = await this.ridesRepository.hasActiveRideOfDriver(driver.id);

    if (driverHasActiveRide) {
      throw new Error('driver already accepted another ride');
    }

    ride.attachDriver(driver.id);

    await this.ridesRepository.update(ride);
  }
}

export default AcceptRide;
