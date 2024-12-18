import type AccountsGateway from '~/application/gateways/accounts-gateway';
import ConflictException from '~/application/exceptions/conflict-exception';
import ForbiddenException from '~/application/exceptions/forbidden-exception';
import NotFoundException from '~/application/exceptions/not-found-exception';
import type RidesRepository from '~/application/repositories/rides-repository';
import { inject } from '~/infra/registry';

type Input = {
  driverId: string;
  rideId: string;
};

class AcceptRide {
  @inject('AccountsGateway')
  private readonly accountsGateway!: AccountsGateway;

  @inject('RidesRepository')
  private readonly ridesRepository!: RidesRepository;

  async execute(input: Input): Promise<void> {
    const driver = await this.accountsGateway.getById(input.driverId);

    if (!driver) {
      throw new NotFoundException('driver not found');
    }

    if (!driver.isDriver) {
      throw new ForbiddenException(
        'account needs to be of a driver to accept a ride'
      );
    }

    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    if (ride.getStatus() !== 'requested') {
      throw new ConflictException('ride already accepted by another driver');
    }

    const driverHasActiveRide
      = await this.ridesRepository.hasActiveRideOfDriver(driver.id);

    if (driverHasActiveRide) {
      throw new ConflictException('driver already have an active ride');
    }

    ride.accept(driver.id);

    await this.ridesRepository.update(ride);
  }
}

export default AcceptRide;
