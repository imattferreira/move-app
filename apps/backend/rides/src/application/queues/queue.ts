interface Queue {
  consume<T extends Record<string, unknown>>(
    event: string,
    callback: (data: T) => Promise<void>
  ): Promise<void>;
  publish(event: string, data: Record<string, unknown>): Promise<void>;
}

export default Queue;
