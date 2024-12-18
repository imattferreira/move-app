import type AccountsGateway from '~/application/gateways/accounts-gateway';
import DistanceCalculator from '~/domain/service/distance-calculator';
import NotFoundException from '~/application/exceptions/not-found-exception';
import PositionsRepository from '~/application/repositories/positions-repository';
import type RidesRepository from '~/application/repositories/rides-repository';
import { inject } from '~/infra/registry';

type Input = {
  rideId: string;
};

type Output = {
  id: string;
  passengerId: string;
  driverId: string | null;
  status: string;
  fare: number;
  distance: number;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: string;
  passengerName: string;
};

class GetRide {
  @inject('AccountsGateway')
  private readonly accountsGateway!: AccountsGateway;

  @inject('PositionsRepository')
  private readonly positionsRepository!: PositionsRepository;

  @inject('RidesRepository')
  readonly ridesRepository!: RidesRepository;

  async execute(input: Input): Promise<Output> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    const passenger = await this.accountsGateway.getById(ride.getPassengerId());
    const positions = await this.positionsRepository.getAllByRideId(
      ride.getId()
    );

    // TODO: create test about it
    const distance
      = ride.getStatus() === 'completed'
        ? ride.getDistance()
        : DistanceCalculator.calculateDistanceBetweenPositions(positions);

    return {
      id: ride.getId(),
      passengerName: passenger.name,
      passengerId: ride.getPassengerId(),
      driverId: ride.getDriverId(),
      status: ride.getStatus(),
      fare: ride.getFare(),
      distance,
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      date: ride.getDate().toISOString()
    };
  }
}

export default GetRide;
