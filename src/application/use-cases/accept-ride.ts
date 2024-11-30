import type AccountsRepository from '~/application/repositories/accounts-repository';
import type RidesRepository from '~/application/repositories/rides-repository';
import NotFoundException from '~/application/exceptions/not-found-exception';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';

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
      throw new NotFoundException('driver not found');
    }

    if (!driver.isDriver) {
      throw new ForbiddenException(
        'user needs to be a driver to accept a ride'
      );
    }

    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    if (ride.status !== 'requested') {
      throw new ConflictException('ride already accepted by another driver');
    }

    const driverHasActiveRide
      = await this.ridesRepository.hasActiveRideOfDriver(driver.id);

    if (driverHasActiveRide) {
      throw new ConflictException('driver already have a ride active');
    }

    ride.attachDriver(driver.id);

    await this.ridesRepository.update(ride);
  }
}

export default AcceptRide;
