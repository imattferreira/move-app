import NotFoundException from '~/application/exceptions/not-found-exception';
import type RidesRepository from '~/application/repositories/rides-repository';

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
};

class GetRide {
  constructor(private readonly ridesRepository: RidesRepository) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.ridesRepository.findById(input.rideId);

    if (!ride) {
      throw new NotFoundException('ride not found');
    }

    return {
      id: ride.getId(),
      passengerId: ride.getPassengerId(),
      driverId: ride.getDriverId(),
      status: ride.getStatus(),
      fare: ride.getFare(),
      distance: ride.getDistance(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      date: ride.getDate().toUTCString()
    };
  }
}

export default GetRide;
