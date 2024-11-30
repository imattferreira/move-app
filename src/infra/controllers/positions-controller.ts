import UpdatePosition from '~/application/use-cases/update-position';
import HttpServer from '~/infra/http/http-server';

class PositionsController {
  constructor(httpServer: HttpServer, updatePosition: UpdatePosition) {
    httpServer.register('POST', '/positions', updatePosition.execute);
  }
}

export default PositionsController;
