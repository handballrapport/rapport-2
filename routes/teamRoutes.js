import express from "express";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
} from "../controllers/TeamController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/", upload.single("avatar"), createTeam);

router.get("/", getAllTeams);

router.get("/:id", getTeamById);

router.put("/:id", upload.single("avatar"), updateTeam);

router.delete("/:id", deleteTeam);

export default router;
