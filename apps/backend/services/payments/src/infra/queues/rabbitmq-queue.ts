import Queue from '~/application/queues/queue';
import QueueConnection from '~/infra/connections/queue-connection';
import { inject } from '~/infra//registry';

class RabbitMqQueue implements Queue {
  @inject('QueueConnection')
  private readonly connection!: QueueConnection;

  async consume<T extends Record<string, unknown>>(
    event: string,
    callback: (data: T) => Promise<void>
  ): Promise<void> {
    this.connection.consume(event, async (event) => {
      const parsed = JSON.parse(event.data.toString()) as T;

      await callback(parsed);
      event.destroy();
    });
  }

  async publish(event: string, data: Record<string, unknown>): Promise<void> {
    const parsed = Buffer.from(JSON.stringify(data));

    await this.connection.publish(event, parsed);
  }
}

export default RabbitMqQueue;
