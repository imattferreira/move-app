import { type Request, type Response } from 'express';
import { PsqlAccountsRepository } from './repositories/accounts-repository';
import SignUp from './use-cases/signup';
import GetAccount from './use-cases/get-account';
import { PsqlRidesRepository } from './repositories/rides-repository';
import RequestRide from './use-cases/request-ride';
import { camelfy, snakefy } from './utils/object';
import GetRide from './use-cases/get-ride';

export async function signup(req: Request, res: Response): Promise<void> {
 	try {
    const input = camelfy(req.body) as any;

    const accountsRepository = new PsqlAccountsRepository();
    const signup = new SignUp(accountsRepository);

    const output = await signup.execute(input);

    res.status(201).json(snakefy(output));
  } catch (err: any) {
    res.status(422).json({ message: err.message });
  }
}

export async function getAccountById(req: Request, res: Response): Promise<void> {
  try {
    const accountId = req.params.accountId;

    const accountsRepository = new PsqlAccountsRepository();
    const getAccount = new GetAccount(accountsRepository);

    const output = await getAccount.execute({ accountId });

    res.json(snakefy(output));
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function requestRide(req: Request, res: Response): Promise<void> {
  try {
    const input = camelfy(req.body) as any;

    const accountsRepository = new PsqlAccountsRepository();
    const ridesRepository = new PsqlRidesRepository();
    const requestRide = new RequestRide(accountsRepository, ridesRepository);

    const output = await requestRide.execute(input);

    res.status(201).json(snakefy(output));
  } catch (err: any) {
    // TODO: adjust status code
    res.status(422).json({ message: err.message });
  }
}

export async function getRide(req: Request, res: Response): Promise<void> {
  try {
    const rideId = req.params.rideId;

    const ridesRepository = new PsqlRidesRepository();
    const requestRide = new GetRide(ridesRepository);

    const output = await requestRide.execute({ rideId });

    res.json(snakefy(output));
  } catch (err: any) {
    // TODO: adjust status code
    res.status(404).json({ message: err.message });
  }
}
