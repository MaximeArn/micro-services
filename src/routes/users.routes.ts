import { Router } from "express";
import * as UsersController from "../controllers/users.controller";

const router = Router();

router.get("/", UsersController.getAll);
router.get("/:id", UsersController.getOne);
router.post("/", UsersController.create);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.remove);

export default router;
