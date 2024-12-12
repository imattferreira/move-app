import HttpServer from '~/infra/http/http-server';
import UpdatePosition from '~/application/use-cases/update-position';

class PositionsController {
  constructor(httpServer: HttpServer, updatePosition: UpdatePosition) {
    httpServer.register('POST', '/v1/positions', updatePosition);
  }
}

export default PositionsController;
