import RidesGateway, {
  GetRideOutput,
} from "~/application/gateways/rides-gateway";
import HttpClient from "~/infra/http/http-client";
import { inject } from "~/infra/registry";

class HttpRidesGateway implements RidesGateway {
  @inject("HttpClient")
  private readonly client!: HttpClient;

  getById(rideId: string): Promise<GetRideOutput> {
    return this.client.get(`http://localhost:3000/v1/rides/${rideId}`);
  }
}

export default HttpRidesGateway;
