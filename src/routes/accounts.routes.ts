import { Router } from "express";
import * as AccountsController from "../controllers/accounts.controller";

const router = Router({ mergeParams: true });

router.get("/", AccountsController.getByUser);
router.get("/:id", AccountsController.getOne);
router.post("/", AccountsController.create);
router.delete("/:id", AccountsController.remove);

// Money transfer route
router.post("/transfer", AccountsController.transfer);

// Exchanges history routes
router.get("/exchanges", AccountsController.exchanges);
router.get("/:id/exchanges", AccountsController.exchanges);

export default router;
