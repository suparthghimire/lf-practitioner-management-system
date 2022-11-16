import express from "express";
import PractitionerController from "../controllers/Practitioner.Controller";
import AttachExistingData from "../middleware/AttachExistingData.Middleware";
const router = express.Router();

router.get("/", PractitionerController.index);
router.post("/", AttachExistingData, PractitionerController.post);
router.put(
  "/:practitioner_id",
  AttachExistingData,
  PractitionerController.update
);
router.delete("/:practitioner_id", PractitionerController.delete);
export default router;
