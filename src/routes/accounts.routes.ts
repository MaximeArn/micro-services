import { Router } from "express";
import * as AccountsController from "../controllers/accounts.controller";

const router = Router({ mergeParams: true });

router.get("/", AccountsController.getByUser);
router.get("/:id", AccountsController.getOne);
router.post("/", AccountsController.create);
router.delete("/:id", AccountsController.remove);

export default router;
