CREATE TABLE IF NOT EXISTS ccca.transaction (
  transaction_id  UUID                  PRIMARY KEY,
  ride_id         UUID        NOT NULL,
  amount          NUMERIC     NOT NULL,
  status          TEXT        NOT NULL,
  date            TIMESTAMP   NOT NULL,
  
  CONSTRAINT fk_transaction_ride_id
  FOREIGN KEY (ride_id)
  REFERENCES ccca.ride(ride_id)
  ON DELETE RESTRICT
);
