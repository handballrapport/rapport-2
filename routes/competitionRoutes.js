import express from "express";
import {
  createCompetition,
  deleteCompetition,
  getAllCompetitions,
  getCompetitionById,
  updateCompetition,
} from "../controllers/competitionController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/", upload.single("avatar"), createCompetition);
router.get("/", getAllCompetitions);
router.get("/:id", getCompetitionById);
router.put("/:id", upload.single("avatar"), updateCompetition);
router.delete("/:id", deleteCompetition);

export default router;
