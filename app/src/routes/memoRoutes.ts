import { Router } from "express";
import * as memoController from "../controllers/memoController";

export const memoRoutes = Router();

memoRoutes.get("/", memoController.list);
memoRoutes.get("/:id", memoController.show);
memoRoutes.post("/", memoController.create);
memoRoutes.put("/:id", memoController.update);
memoRoutes.delete("/:id", memoController.remove);
