import NotFoundException from '~/application/exceptions/not-found-exception';
import ProcessPayment from './process-payment';
import Ride from '~/domain/entities/ride';
import RidesRepositoryInMemory from '~/infra/repositories/in-memory/rides-repository';

describe('ProcessPayment', () => {
  it('should be able process a payment of a ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const processPayment = new ProcessPayment(ridesRepository);

    const ride = Ride.create(
      Math.random().toString(),
      -27.584905257808835,
      -48.545022195325124,
      -27.496887588317275,
      -48.522234807851476
    );
    ride.accept(Math.random().toString());
    ride.start();
    ride.setDistance(10);
    ride.setFare(21.0);

    await ridesRepository.save(ride);

    const input = {
      rideId: ride.getId(),
      creditCardToken: Math.random().toString(),
      amount: ride.getFare()
    };

    await processPayment.execute(input);

    // TODO: finish it
    // expect()
  });

  it('should not a payment of a non-existing ride', async () => {
    const ridesRepository = new RidesRepositoryInMemory();
    const processPayment = new ProcessPayment(ridesRepository);

    const input = {
      rideId: Math.random().toString(),
      creditCardToken: Math.random().toString(),
      amount: 21
    };

    await expect(
      () => processPayment.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
