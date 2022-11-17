import express from "express";
import PractitionerController from "../controllers/Practitioner.Controller";
import AttachExistingData from "../middleware/AttachExistingData.Middleware";
import { IsLoggedIn } from "../middleware/Auth.Middleware";
import { HasWritePermission } from "../middleware/Authorization.Middleware";
const router = express.Router();

router.get("/", IsLoggedIn, PractitionerController.index);
router.get("/:practitioner_id", IsLoggedIn, PractitionerController.show);
router.post("/", [IsLoggedIn, AttachExistingData], PractitionerController.post);
router.put(
  "/:practitioner_id",
  [IsLoggedIn, HasWritePermission, AttachExistingData],
  PractitionerController.update
);
router.delete(
  "/:practitioner_id",
  [IsLoggedIn, HasWritePermission],
  PractitionerController.delete
);
export default router;
