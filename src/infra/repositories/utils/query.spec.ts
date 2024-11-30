import { sql } from './query';

describe('sql', () => {
  it('should remove unnused whitespaces from SQL syntax', () => {
    const output = sql`
      INSERT INTO ccca.account (
      account_id,
      name,
      email,
      cpf,
      car_plate,
      is_passenger,
      is_driver,
      password
    ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
  );`;

    // eslint-disable-next-line @stylistic/max-len
    const expected = 'INSERT INTO ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';

    expect(output).toBe(expected);
  });
});
