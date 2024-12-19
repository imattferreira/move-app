import amqp, { type Connection } from 'amqplib';

export type QueueEvent = {
  data: Buffer;
  destroy(): void;
};

interface QueueConnection {
  connect(): Promise<void>;
  close(): Promise<void>;
  consume(
    event: string,
    callback: (event: QueueEvent) => Promise<void>
  ): Promise<void>;
  publish(event: string, data: Buffer): Promise<void>;
}

export class RabbitMqAdapter implements QueueConnection {
  private connection: Connection | null;

  constructor() {
    this.connection = null;
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect('amqp://localhost');
  }

  async close(): Promise<void> {
    await this.connection?.close();
  }

  async consume(
    event: string,
    callback: (event: QueueEvent) => Promise<void>
  ): Promise<void> {
    if (!this.connection) {
      throw new Error('Queue not connected');
    }

    const channel = await this.connection.createChannel();

    channel.consume(event, async (message) => {
      if (!message) {
        return;
      }

      const e: QueueEvent = {
        data: message.content,
        destroy: () => {
          channel.ack(message);
        }
      };

      await callback(e);
    });
  }

  async publish(event: string, data: Buffer): Promise<void> {
    if (!this.connection) {
      throw new Error('Queue not connected');
    }

    const channel = await this.connection.createChannel();

    channel.publish(event, '', data);
  }
}

export default QueueConnection;
