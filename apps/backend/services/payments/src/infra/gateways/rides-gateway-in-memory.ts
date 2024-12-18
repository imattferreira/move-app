import RidesGateway, {
  GetRideOutput,
} from "~/application/gateways/rides-gateway";

class RidesGatewayInMemory implements RidesGateway {
  getById(rideId: string): Promise<GetRideOutput> {
    throw new Error("Method not implemented.");
  }
}

export default RidesGatewayInMemory;
