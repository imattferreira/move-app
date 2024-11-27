import type { Request, Response } from "express";
import { PsqlAccountsRepository } from "./repositories/accounts-repository";
import SignUp from "./use-cases/signup";
import GetAccount from "./use-cases/get-account";

export async function signup(req: Request, res: Response) {
 	const input = req.body;

   const accountsRepository = new PsqlAccountsRepository();
   const signup = new SignUp(accountsRepository);

   const output = await signup.execute(input);

   if ('message' in output) {
     return res.status(422).json({ message: output.message });
   }

   return res.json(output);
}

export async function getAccountById(req: Request, res: Response) {
  const accountId = req.params.accountId;

  const accountsRepository = new PsqlAccountsRepository();
  const getAccount = new GetAccount(accountsRepository);

  const output = await getAccount.execute({ accountId });

  if ('message' in output) {
    return res.sendStatus(404);
  }

  return res.json(output);
}
