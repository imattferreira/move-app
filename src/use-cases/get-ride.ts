import type RidesRepository from "../repositories/rides-repository";

interface Input {
  rideId: string;
}

interface Output {
  id: string;
  passenger_id: string;
  driver_id: string | null;
  status: string;
  fare: number;
  distance: number;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
  date: string;
}

class GetRide {
  constructor(private readonly ridesRepository: RidesRepository) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.ridesRepository.findByRideId(input.rideId);

    if (!ride) {
      throw new Error('ride not found');
    }

    return {
      id: ride.id,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      status: ride.status,
      fare: ride.fare,
      distance: ride.distance,
      from_lat: ride.from_lat,
      from_long: ride.from_long,
      to_lat: ride.to_lat,
      to_long: ride.to_long,
      date: ride.date.toUTCString()
    };
  }
}

export default GetRide;
