import type { Request, Response } from "express";
import { PsqlAccountsRepository } from "./repositories/accounts-repository";
import SignUp from "./use-cases/signup";
import GetAccount from "./use-cases/get-account";

export async function signup(req: Request, res: Response) {
 	try {
    const input = req.body;

    const accountsRepository = new PsqlAccountsRepository();
    const signup = new SignUp(accountsRepository);

    const output = await signup.execute(input);

    return res.json(output);
  } catch (err: any) {
    return res.status(422).json({ message: err.message });
  }
}

export async function getAccountById(req: Request, res: Response) {
  try {
    const accountId = req.params.accountId;

    const accountsRepository = new PsqlAccountsRepository();
    const getAccount = new GetAccount(accountsRepository);

    const output = await getAccount.execute({ accountId });

    return res.json(output);

  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
}
