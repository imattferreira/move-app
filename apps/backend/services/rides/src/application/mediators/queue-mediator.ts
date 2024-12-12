type Callback = <T>(data: T) => void;

interface QueueMediator {
  notify(event: string, data: Record<string, unknown>): void;
  register(event: string, callback: Callback): void;
}

export default QueueMediator;
