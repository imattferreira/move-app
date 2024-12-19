import Queue from '~/application/queues/queue';

class QueueInMemory implements Queue {
  events: { event: string; data: Record<string, unknown> }[];

  constructor() {
    this.events = [];
  }

  async consume<T extends Record<string, unknown>>(
    event: string,
    callback: (data: T) => Promise<void>
  ): Promise<void> {
    setInterval(() => {
      for (const e of this.events) {
        if (e.event === event) {
          callback(e.data as T);
        }
      }
    }, 1000);
  }

  async publish(event: string, data: Record<string, unknown>): Promise<void> {
    this.events.push({ event, data });
  }
}

export default QueueInMemory;
