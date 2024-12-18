type Callback = <T>(data: T) => void;

type Handler = {
  event: string;
  callback: Callback;
};

class Mediator {
  private handlers: Handler[];

  constructor() {
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

export default Mediator;
