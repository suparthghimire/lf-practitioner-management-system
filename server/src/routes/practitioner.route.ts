import express from "express";
import PractitionerController from "../controllers/Practitioner.Controller";
const router = express.Router();

router.get("/", PractitionerController.index);
router.post("/", PractitionerController.post);
router.put("/:practitioner_id", PractitionerController.update);
router.delete("/:practitioner_id", PractitionerController.delete);
export default router;
