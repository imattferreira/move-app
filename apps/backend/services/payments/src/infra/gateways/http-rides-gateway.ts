import RidesGateway, { GetRideOutput } from '~/application/gateways/rides-gateway';
import HttpClient from '~/infra/http/http-client';

class HttpRidesGateway implements RidesGateway {
  constructor(private readonly client: HttpClient) {}

  getById(rideId: string): Promise<GetRideOutput> {
    return this.client.get(`http://localhost:3001/rides/${rideId}`);
  }
}

export default HttpRidesGateway;
