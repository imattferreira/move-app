import PaymentsGateway from '~/application/gateways/payments-gateway';

type Callback = <T>(data: T) => void;

type Handler = {
  event: string;
  callback: Callback;
};

class QueueMediator {
  private handlers: Handler[];

  constructor(private readonly paymentsGateway: PaymentsGateway) {
    this.handlers = [];
  }

  notify(event: string, data: Record<string, unknown>) {
    for (const handler of this.handlers) {
      if (handler.event === event) {
        handler.callback(data);
      }
    }
  }

  register(event: string, callback: Callback) {
    this.handlers.push({
      event,
      callback
    });
  }
}

export default QueueMediator;
