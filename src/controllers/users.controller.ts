import { Request, Response } from "express";
import * as UsersService from "../services/users.service";

export const getAll = async (req: Request, res: Response) => {
  const users = await UsersService.getAllUsers();
  res.json(users);
};

export const getOne = async (req: Request, res: Response) => {
  const user = await UsersService.getUserById(Number(req.params.id));
  if (!user) res.status(404).json({ message: "Utilisateur non trouvé" });
  else res.json(user);
};

export const create = async (req: Request, res: Response) => {
  try {
    const user = await UsersService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Email déjà utilisé ou données invalides" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await UsersService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await UsersService.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
  }
};
