export type GetRideOutput = {
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

interface RidesGateway {
  getById(rideId: string): Promise<GetRideOutput>;
}

export default RidesGateway;
