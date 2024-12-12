export type ProcessPaymentInput = {
  rideId: string;
  amount: number;
};

interface PaymentsGateway {
  process(data: ProcessPaymentInput): Promise<void>;
};

export default PaymentsGateway;
