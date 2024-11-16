import express from "express";
import {
  createHandballGame,
  getAllHandballGames,
  getHandballGameById,
  updateHandballGame,
  deleteHandballGame,
} from "../controllers/gameController.js";

const router = express.Router();

// Route to create a new handball game
router.post("/", createHandballGame);

// Route to get all handball games
router.get("/", getAllHandballGames);

// Route to get a specific handball game by ID
router.get("/:id", getHandballGameById);

// Route to update a handball game by ID
router.put("/:id", updateHandballGame);

// Route to delete a handball game by ID
router.delete("/:id", deleteHandballGame);

export default router;
