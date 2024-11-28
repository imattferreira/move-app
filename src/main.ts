import express from "express";
import { getAccountById, getRide, requestRide, signup } from './handlers';

const app = express();
app.use(express.json());

app.post("/signup", signup);
app.get("/accounts/:accountId", getAccountById);
app.post("/rides", requestRide);
app.get("/rides/:rideId", getRide);

app.listen(3000);
