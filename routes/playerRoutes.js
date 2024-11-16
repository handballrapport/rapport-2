import express from "express";
import {
  createPlayer,
  deletePlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  updatePlayerStatistics
} from "../controllers/PlayerController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

router.put("/:id/statistics", updatePlayerStatistics);
router.post("/",upload.single("avatar"),createPlayer);

router.get("/", getAllPlayers);

router.get("/:id", getPlayerById);

router.put("/:id",upload.single("avatar"), updatePlayer);

router.delete("/:id", deletePlayer);

export default router;
