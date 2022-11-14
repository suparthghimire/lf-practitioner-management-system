import express from "express";
const router = express.Router();

import PractitionerController from "../controllers/Practitioner.Controller";

router.get("/", PractitionerController.index);
router.post("/", PractitionerController.post);
router.put("/:practitioner_id", PractitionerController.update);
router.delete("/:practitioner_id", PractitionerController.delete);
export default router;
