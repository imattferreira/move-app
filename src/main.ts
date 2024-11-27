import express from "express";
import { getAccountById, signup } from './handlers';

const app = express();
app.use(express.json());

app.post("/signup", signup);
app.get("/accounts/:accountId", getAccountById);

app.listen(3000);
