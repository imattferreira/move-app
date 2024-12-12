import PaymentsGateway, { ProcessPaymentInput } from '~/application/gateways/payments-gateway';
import HttpClient from '~/infra/http/http-client';

class HttpPaymentsGateway implements PaymentsGateway {
  constructor(private readonly client: HttpClient) {}

  async process(data: ProcessPaymentInput): Promise<void> {
    await this.client.post('http://localhost:3003/v1/payments/rides/', data);
  }
}

export default HttpPaymentsGateway;
