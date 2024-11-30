import type { Object } from '~/utils/types';
import { makeAccountFactory } from './factories/entities';
import { makeRequest } from './utils';

describe('POST /signup', () => {
  it('should be able create a driver user', async () => {
    const input = makeAccountFactory({ is_driver: true });

    const signupRes = await makeRequest<{ account_id: string }>(
      '/signup',
      input
    );

    expect(signupRes.status).toBe(200);
    expect(signupRes.data.account_id).toBeDefined();

    const registeredAccountRes = await makeRequest<Object>(
      `/accounts/${signupRes.data.account_id}`
    );

    expect(registeredAccountRes.status).toBe(200);
    expect(registeredAccountRes.data.name).toBe(input.name);
    expect(registeredAccountRes.data.email).toBe(input.email);
    expect(registeredAccountRes.data.cpf).toBe(input.cpf);
    expect(registeredAccountRes.data.is_driver).toBe(true);
    expect(registeredAccountRes.data.is_passenger).toBe(false);
    expect(registeredAccountRes.data.car_plate).toBe(input.car_plate);
    expect(registeredAccountRes.data.password).toBe(input.password);
  });

  it('should not create a driver user with a invalid car plate', async () => {
    const input = makeAccountFactory({ is_driver: true, car_plate: 'ABC' });

    const res = await makeRequest<{ message: number }>('/signup', input);

    expect(res.status).toBe(400);
    expect(res.data.message).toBe('invalid [carPlate] field');
  });

  it('should not create a user with a already registered email', async () => {
    const input = makeAccountFactory({ is_passenger: true });

    await makeRequest('/signup', input);
    const res = await makeRequest<{ message: number }>('/signup', input);

    expect(res.status).toBe(409);
    expect(res.data.message).toBe('[email] already registered');
  });
});
