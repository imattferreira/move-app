type Callback = <T>(data: T) => void;

interface Mediator {
  notify(event: string, data: Record<string, unknown>): void;
  register(event: string, callback: Callback): void;
}

export default Mediator;
