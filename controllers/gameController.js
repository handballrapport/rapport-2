import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import HandballGame from "../models/Game.js";
import Event from "../models/event.js"; // Import the Event model

// Create a new handball game
export const createHandballGame = asyncHandler(async (req, res) => {
  const newGame = new HandballGame(req.body);

  await newGame.save();
  res.status(StatusCodes.CREATED).json(newGame);
});

// Get all handball games
export const getAllHandballGames = asyncHandler(async (req, res) => {
  const games = await HandballGame.find()
    .populate("home_team")
    .populate("away_team");
  res.status(StatusCodes.OK).json(games);
});

// Get a handball game by ID
export const getHandballGameById = asyncHandler(async (req, res) => {
  const game = await HandballGame.findById(req.params.id)
    .populate("home_team")
    .populate("away_team");

  if (!game) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Handball game not found" });
  }

  res.status(StatusCodes.OK).json(game);
});

// Update a handball game
export const updateHandballGame = asyncHandler(async (req, res) => {
  console.log(req.body)
  const updatedGame = await HandballGame.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("home_team")
    .populate("away_team");

  if (!updatedGame) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Handball game not found" });
  }

  res.status(StatusCodes.OK).json({
    message: "Handball game updated successfully",
    updatedGame,
  });
});

export const deleteHandballGame = asyncHandler(async (req, res) => {
  const game = await HandballGame.findById(req.params.id);

  if (!game) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Handball game not found" });
  }

  // Delete all events associated with the game
  await Event.deleteMany({ game: game._id });

  // Delete the game from the database
  await HandballGame.deleteOne({ _id: req.params.id });

  res
    .status(StatusCodes.OK)
    .json({ message: "Handball game and associated events removed" });
});

