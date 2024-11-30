import HttpServer from "../http/http-server";
import GetRide from "../../application/use-cases/get-ride";
import RequestRide from "../../application/use-cases/request-ride";
import AcceptRide from "../../application/use-cases/accept-ride";
import StartRide from "../../application/use-cases/start-ride";

class RidesController {
  constructor(
    httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide,
    startRide: StartRide
  ) {
    httpServer.register('POST', '/rides', requestRide.execute);
    httpServer.register('GET', '/rides/:{rideId}', getRide.execute);
    httpServer.register('POST', '/rides/:{rideId}/:{driverId}', acceptRide.execute);
    httpServer.register('PATCH', '/rides/:{rideId}', startRide.execute);
  }
}

export default RidesController;
