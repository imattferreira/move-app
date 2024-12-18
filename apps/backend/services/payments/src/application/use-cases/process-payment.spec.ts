import "~/main";
import ConflictException from "~/application/exceptions/conflict-exception";
import Identifier from "~/domain/value-objects/identifier";
import NotFoundException from "~/application/exceptions/not-found-exception";
import ProcessPayment from "./process-payment";
import Registry from "~/infra/registry/registry";
import TransactionsRepository from "~/application/repositories/transactions-repository";
import RidesGateway from "../gateways/rides-gateway";

describe("ProcessPayment", () => {
  it("should be able to process a payment of a completed ride", async () => {
    const registry = Registry.getInstance();
    const ridesGateway = registry.inject<RidesGateway>("RidesGateway");
    const transactionsRepository = registry.inject<TransactionsRepository>(
      "TransactionsRepository"
    );
    const processPayment = new ProcessPayment();

    // const ride = Ride.create(
    //   Identifier.create().getValue(),
    //   -27.584905257808835,
    //   -48.545022195325124,
    //   -27.496887588317275,
    //   -48.522234807851476
    // );
    // ride.accept(Identifier.create().getValue());
    // ride.start();
    // ride.finish([]);

    // await ridesGateway.save(ride);

    // const input = { rideId: ride.getId() };
    // const output = await processPayment.execute(input);

    // const transaction = await transactionsRepository.findById(
    //   output.transactionId
    // );

    // expect(transaction?.getId()).toBe(output.transactionId);
    // expect(transaction?.getRideId()).toBe(ride.getId());
    // expect(transaction?.getAmount()).toBe(ride.getFare());
    // expect(transaction?.getStatus()).toBe("processing");
    // expect(transaction?.getDate()).toBeInstanceOf(Date);
  });

  it("should not be able to process a payment of a non-existing ride", async () => {
    const processPayment = new ProcessPayment();

    const input = { rideId: Identifier.create().getValue() };

    await expect(processPayment.execute(input)).rejects.toThrow(
      new NotFoundException("ride not found")
    );
  });

  it("should not be able to process a payment of a non-completed ride", async () => {
    // const registry = Registry.getInstance();
    // const ridesRepository = registry.inject<RidesRepository>("RidesRepository");
    // const processPayment = new ProcessPayment();
    // const ride = Ride.create(
    //   Identifier.create().getValue(),
    //   -27.584905257808835,
    //   -48.545022195325124,
    //   -27.496887588317275,
    //   -48.522234807851476
    // );
    // await ridesRepository.save(ride);
    // const input = { rideId: ride.getId() };
    // await expect(processPayment.execute(input)).rejects.toThrow(
    //   new ConflictException("ride not finished yet")
    // );
  });
});
