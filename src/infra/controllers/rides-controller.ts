import AcceptRide from '~/application/use-cases/accept-ride';
import GetRide from '~/application/use-cases/get-ride';
import HttpServer from '~/infra/http/http-server';
import RequestRide from '~/application/use-cases/request-ride';
import StartRide from '~/application/use-cases/start-ride';

class RidesController {
  constructor(
    httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide,
    startRide: StartRide
  ) {
    httpServer.register('POST', '/rides', requestRide);
    httpServer.register('GET', '/rides/:{rideId}', getRide);
    httpServer.register('POST', '/rides/:{rideId}/:{driverId}', acceptRide);
    httpServer.register('PATCH', '/rides/:{rideId}', startRide);
  }
}

export default RidesController;
