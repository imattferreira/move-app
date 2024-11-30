import HttpServer from "../adapters/http-server";
import GetRide from "../use-cases/get-ride";
import RequestRide from "../use-cases/request-ride";

class RidesController {
  constructor(
    httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide
  ) {
    httpServer.register('POST', '/rides', requestRide.execute);
    httpServer.register('GET', '/rides/:{rideId}', getRide.execute);
  }
}

export default RidesController;
