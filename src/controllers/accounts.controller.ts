import { Request, Response } from "express";
import * as AccountsService from "../services/accounts.service";

export const getByUser = async (req: Request, res: Response) => {
  const accounts = await AccountsService.getAccountsByUser(
    Number(req.params.userId),
  );
  res.json(accounts);
};

export const getOne = async (req: Request, res: Response) => {
  const account = await AccountsService.getAccountById(Number(req.params.id));
  if (!account) res.status(404).json({ message: "Compte non trouvé" });
  else res.json(account);
};

export const create = async (req: Request, res: Response) => {
  try {
    const account = await AccountsService.createAccount(
      Number(req.params.userId),
    );
    res.status(201).json(account);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await AccountsService.deleteAccount(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Compte non trouvé" });
  }
};

// POST /users/:userId/accounts/transfer
export const transfer = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    const exchange = await AccountsService.transferMoney(Number(senderId), Number(receiverId), Number(amount));
    res.status(201).json(exchange);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /users/:userId/accounts/exchanges or /users/:userId/accounts/:id/exchanges
export const exchanges = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id ? Number(req.params.id) : undefined;
    const exchanges = await AccountsService.getExchanges(accountId);
    res.json(exchanges);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
