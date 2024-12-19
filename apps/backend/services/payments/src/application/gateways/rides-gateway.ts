export type RequestRideInput = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

export type RequestRideOutput = {
  rideId: string;
};

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
  request(input: RequestRideInput): Promise<RequestRideOutput>;
  getById(rideId: string): Promise<GetRideOutput | null>;
}

export default RidesGateway;
