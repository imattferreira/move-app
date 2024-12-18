import HttpServer from '~/infra/http/http-server';
import UpdatePosition from '~/application/use-cases/update-position';
import { inject } from '~/infra/registry';

class PositionsController {
  @inject('HttpServer')
  private readonly httpServer!: HttpServer;

  @inject('UpdatePosition')
  private readonly updatePosition!: UpdatePosition;

  constructor() {
    this.httpServer.register('POST', '/v1/positions', this.updatePosition);
  }
}

export default PositionsController;
