import { makeRequest } from "./utils";

describe('POST /signup', () => {
  it("should be able create a driver user", async () => {
    const input = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      is_driver: true,
      car_plate: 'ABC1234',
      password: '123456'
    };

    const signupRes = await makeRequest<{ accountId: string }>('/signup', input);

    expect(signupRes.status).toBe(201);
    expect(signupRes.data.accountId).toBeDefined();

    const registeredAccountRes = await makeRequest<Record<string, unknown>>(
      `/accounts/${signupRes.data.accountId}`
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

  it.only("should not create a driver user with a invalid car plate", async () => {
    const input = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      is_driver: true,
      car_plate: 'ABC',
      password: '123456'
    };

    const res = await makeRequest<{ message: number }>('/signup', input);

    expect(res.status).toBe(422);
    expect(res.data.message).toBe("invalid [carPlate] field");
  });

  it("should not create a user with a already registered email", async () => {
    const input = {
      name: 'John Doe',
      email: `john${Math.random()}@doe.com`,
      cpf: '475.646.550-11',
      is_passenger: true,
      password: '123456'
    };

    await makeRequest('/signup', input);
    const res = await makeRequest<{ message: number }>('/signup', input);

    expect(res.status).toBe(422);
    expect(res.data.message).toBe("[email] already registered");
  });
});
