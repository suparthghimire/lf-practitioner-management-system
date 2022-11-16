import express from "express";
import PractitionerController from "../controllers/Practitioner.Controller";
import AttachExistingData from "../middleware/AttachExistingData.Middleware";
import { IsLoggedIn } from "../middleware/Auth.Middleware";
const router = express.Router();

router.get("/", IsLoggedIn, PractitionerController.index);
router.post("/", [IsLoggedIn, AttachExistingData], PractitionerController.post);
router.put(
  "/:practitioner_id",
  [IsLoggedIn, AttachExistingData],
  PractitionerController.update
);
router.delete("/:practitioner_id", PractitionerController.delete);
export default router;
