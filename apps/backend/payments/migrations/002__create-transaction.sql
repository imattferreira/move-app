CREATE TABLE IF NOT EXISTS ccca.transaction (
  transaction_id  UUID                  PRIMARY KEY,
  ride_id         UUID        NOT NULL,
  amount          NUMERIC     NOT NULL,
  status          TEXT        NOT NULL,
  date            TIMESTAMP   NOT NULL
);
