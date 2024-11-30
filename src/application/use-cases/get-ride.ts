import type RidesRepository from "../repositories/rides-repository";

interface Input {
  rideId: string;
}

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
    const ride = await this.ridesRepository.findByRideId(input.rideId);

    if (!ride) {
      throw new Error("ride not found");
    }

    return {
      id: ride.id,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      status: ride.status,
      fare: ride.fare,
      distance: ride.distance,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      date: ride.date.toUTCString(),
    };
  }
}

export default GetRide;
