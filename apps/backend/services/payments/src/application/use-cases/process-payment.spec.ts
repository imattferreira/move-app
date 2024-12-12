import { FetchHttpClientAdapter } from '~/infra/http/http-client';
import HttpRidesGateway from '~/infra/gateways/http-rides-gateway';
import NotFoundException from '~/application/exceptions/not-found-exception';
import ProcessPayment from './process-payment';
import TransactionsRepositoryInMemory from '~/infra/repositories/in-memory/transactions-repository';

describe('ProcessPayment', () => {
  it.todo('should be able to charge a payment');

  it('should not charge a payment when a ride not exists', async () => {
    const httpClient = new FetchHttpClientAdapter();
    const ridesGateway = new HttpRidesGateway(httpClient);
    const transactionsRepository = new TransactionsRepositoryInMemory();
    const processPayment = new ProcessPayment(
      transactionsRepository,
      ridesGateway
    );

    const input = {
      rideId: Math.random().toString(),
      amount: 120
    };

    await expect(
      () => processPayment.execute(input)
    ).rejects.toThrow(new NotFoundException('ride not found'));
  });
});
