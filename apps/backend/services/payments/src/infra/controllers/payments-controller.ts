import HttpServer from '~/infra/http/http-server';
import ProcessPayment from '~/application/use-cases/process-payment';

class PaymentsController {
  constructor(
    httpServer: HttpServer,
    processPayment: ProcessPayment
  ) {
    httpServer.register('POST', '/v1/payments/rides', processPayment);
  }
}

export default PaymentsController;
