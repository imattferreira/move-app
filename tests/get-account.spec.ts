import crypto from 'node:crypto';
import type { Object } from '~/utils/types';
import { makeAccountFactory } from './factories/entities';
import { makeRequest } from './utils';

describe('GET /accounts/:accountId', () => {
  it('should be able to get info about a existing account', async () => {
    const input = makeAccountFactory({ is_driver: true });

    const signupRes = await makeRequest<{ account_id: string }>(
      'POST',
      '/signup',
      input
    );

    expect(signupRes.status).toBe(200);
    expect(signupRes.data?.account_id).toBeDefined();

    const registeredAccountRes = await makeRequest<Object>(
      'GET',
      `/accounts/${signupRes.data?.account_id}`
    );

    expect(registeredAccountRes.status).toBe(200);
    expect(registeredAccountRes.data?.email).toBe(input.email);
    expect(registeredAccountRes.data?.cpf).toBe(input.cpf);
    expect(registeredAccountRes.data?.is_driver).toBe(true);
    expect(registeredAccountRes.data?.is_passenger).toBe(false);
    expect(registeredAccountRes.data?.car_plate).toBe(input.car_plate);
    expect(registeredAccountRes.data?.password).toBe(input.password);
  });

  it(
    'should not be able to get info about a non-existing account',
    async () => {
      const accountId = crypto.randomUUID();

      const registeredAccountRes = await makeRequest<Object>(
        'GET',
        `/accounts/${accountId}`
      );

      expect(registeredAccountRes.status).toBe(404);
      expect(registeredAccountRes.data?.message).toBe('account not found');
    }
  );
});
