import "../../../scripts/dotenv";
import RidesGatewayInMemory from "./infra/gateways/rides-gateway-in-memory";
import { ExpressAdapter } from "./infra/http/http-server";
import { FetchHttpClientAdapter } from "./infra/http/http-client";
import HttpRidesGateway from "./infra/gateways/http-rides-gateway";
import { PgPromiseAdapter } from "./infra/connections/database-connection";
import PsqlTransactionsRepository from "./infra/repositories/psql/transactions-repository";
import QueueInMemory from "./infra/queues/queue-in-memory";
import { RabbitMqAdapter } from "./infra/connections/queue-connection";
import RabbitMqQueue from "./infra/queues/rabbitmq-queue";
import Registry from "./infra/registry/registry";
import TransactionsRepositoryInMemory from "./infra/repositories/in-memory/transactions-repository";
import ProcessPayment from "./application/use-cases/process-payment";

const registry = Registry.getInstance();

if (["development", "production"].includes(process.env.NODE_ENV || "")) {
  const httpServer = new ExpressAdapter();
  const queue = new RabbitMqAdapter();

  registry.provide("HttpServer", httpServer);
  registry.provide("QueueConnection", queue);
  registry.provide("Queue", new RabbitMqQueue());
  registry.provide("HttpClient", new FetchHttpClientAdapter());
  registry.provide("RidesGateway", new HttpRidesGateway());
  registry.provide("DatabaseConnection", new PgPromiseAdapter());
  registry.provide("TransactionsRepository", new PsqlTransactionsRepository());

  queue.consume("ride-finished", async (data: any) => {
    await new ProcessPayment().execute(data);
  });

  // const signals = ['SIGINT', 'SIGTERM', 'SIGKILL'];

  // signals.forEach((signal) => {
  //   process.on(signal, async () => {
  //     await connection.close();
  //     process.exit(0);
  //   });
  // });

  httpServer.listen(3000);
}

if (process.env.NODE_ENV === "testing") {
  registry.provide("RidesGateway", new RidesGatewayInMemory());
  registry.provide("Queue", new QueueInMemory());
  registry.provide(
    "TransactionsRepository",
    new TransactionsRepositoryInMemory()
  );
}
