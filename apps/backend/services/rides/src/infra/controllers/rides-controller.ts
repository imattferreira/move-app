import AcceptRide from '~/application/use-cases/accept-ride';
import FinishRide from '~/application/use-cases/finish-ride';
import GetRide from '~/application/use-cases/get-ride';
import HttpServer from '~/infra/http/http-server';
import RequestRide from '~/application/use-cases/request-ride';
import StartRide from '~/application/use-cases/start-ride';
import { inject } from '~/infra/registry';

class RidesController {
  @inject('HttpServer')
  private readonly httpServer!: HttpServer;

  @inject('RequestRide')
  private readonly requestRide!: RequestRide;

  @inject('GetRide')
  private readonly getRide!: GetRide;

  @inject('AcceptRide')
  private readonly acceptRide!: AcceptRide;

  @inject('StartRide')
  private readonly startRide!: StartRide;

  @inject('FinishRide')
  private readonly finishRide!: FinishRide;

  constructor() {
    this.httpServer.register('POST', '/v1/rides', this.requestRide);
    this.httpServer.register('GET', '/v1/rides/:{rideId}', this.getRide);
    this.httpServer.register(
      'POST',
      '/v1/rides/:{rideId}/:{driverId}',
      this.acceptRide
    );
    this.httpServer.register('PATCH', '/v1/rides/:{rideId}', this.startRide);
    this.httpServer.register(
      'PATCH',
      '/v1/rides/:{rideId}/finish',
      this.finishRide
    );
  }
}

export default RidesController;
