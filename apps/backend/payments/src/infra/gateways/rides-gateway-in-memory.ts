import RidesGateway, {
  GetRideOutput,
  RequestRideInput,
  RequestRideOutput
} from '~/application/gateways/rides-gateway';
import Identifier from '~/domain/value-objects/identifier';

class RidesGatewayInMemory implements RidesGateway {
  private rides: GetRideOutput[];

  constructor() {
    this.rides = [];
  }

  async request(input: RequestRideInput): Promise<RequestRideOutput> {
    const id = Identifier.create().getValue();

    this.rides.push({
      ...input,
      id,
      passengerName: 'John Doe',
      driverId: id,
      status: 'requested',
      date: new Date().toISOString(),
      distance: 10,
      fare: 0
    });

    return { rideId: id };
  }

  async getById(rideId: string): Promise<GetRideOutput | null> {
    const ride = this.rides.find(r => r.id === rideId);

    return ride || null;
  }
}

export default RidesGatewayInMemory;
