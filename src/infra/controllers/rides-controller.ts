import HttpServer from "../http/http-server";
import GetRide from "../../application/use-cases/get-ride";
import RequestRide from "../../application/use-cases/request-ride";
import AcceptRide from "../../application/use-cases/accept-ride";

class RidesController {
  constructor(
    httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide
  ) {
    httpServer.register('POST', '/rides', requestRide.execute);
    httpServer.register('GET', '/rides/:{rideId}', getRide.execute);
    httpServer.register('POST', '/rides/:{rideId}/:{driverId}', acceptRide.execute);
  }
}

export default RidesController;
